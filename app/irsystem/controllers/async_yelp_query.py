#!/usr/bin/env python3

import asyncio
import time
import json
import random
import re
from gql import Client, gql
from collections import defaultdict
from collections import Counter

from gql.transport.aiohttp import AIOHTTPTransport

interests = ['''food''', '''activities''']


def get_features():
    f = open('app/irsystem/controllers/features_vecs_lda.json',)
    data = json.load(f)
    categories = []
    for diction in data:
        categories.append(list(diction.keys()))
    return categories


features = get_features()


def get_prefs(pref):
    for feat in features:
        if pref in feat:
            return feat
    return []


def getAPIKey():
    f = open('app/irsystem/controllers/apikeys.json',)
    data = json.load(f)
    return random.choice(list(data.values()))


def getQuery(interest, place, offset):
    query = gql('''{
        search(term:"''' + interest + '''",
            location:"''' + place + '''",
            radius: 40000,
            limit: 50,
            sort_by: "rating",
            offset: ''' + offset + ''') {
                total
                business {
                    name
                    alias
                    price
                    rating
                    display_phone
                    url
                    photos
                    categories {
                        title
                    }
                    reviews {
                        text
                    }
                }
            }
        }
    ''')
    return query


def make_tf(query, reviews):
    tf = {}
    query = set(query)
    for word in reviews:
        if word in query:
            if word in tf:
                tf[word] += 1
            else:
                tf[word] = 1
    for key in tf:
        tf[key] /= len(reviews)
    return tf


def similarity_measure(query, merged_reviews, tf):
    num = 0
    denom = 0
    for word in query:
        if word in tf:
            num += min(1/len(query), tf[word])
            denom += max(1/len(query), tf[word])
        else:
            denom += 1/len(query)
    return num/denom


def similarity_measure_businesses(result, preferences, countlist):

    for business in range(len(result['search']['business'])):
        counter = 0
        merged_reviews = ""
        category_str = ""
        merged_reviews += " " + result['search']['business'][business]['name']
        for review in range(len(result['search']['business'][business]['reviews'])):
            merged_reviews += " " + \
                result['search']['business'][business]['reviews'][review]['text']
        for categories in range(len(result['search']['business'][business]['categories'])):
            if categories == 0:
                category_str += result['search']['business'][business]['categories'][categories]['title']
            elif categories == 1:
                category_str += ", " + \
                    result['search']['business'][business]['categories'][categories]['title']
            merged_reviews += " " + \
                result['search']['business'][business]['categories'][categories]['title']
        # make everything lowercase
        merged_reviews = merged_reviews.lower()
        # remove special chars
        new_merged_reviews = re.sub(r"[^a-zA-Z#]", " ", merged_reviews)
        # remove words that are 1 or 2 letters
        new_merged_reviews = re.sub("\b\w{1,2}\b", " ", new_merged_reviews)
        new_merged_reviews = re.findall(r"[a-z]+", new_merged_reviews)
        # convert reviews & preferences to stemmed list
        tf = make_tf(preferences, new_merged_reviews)
        countlist.append((similarity_measure(preferences, merged_reviews, tf),
                          result['search']['business'][business]['name'], result['search']['business'][business]['url'], category_str, result['search']['business'][business]['rating'], result['search']['business'][business]['photos'][0]))


async def execute_query(session, interest, place, preferences):
    result = await session.execute(getQuery(interest, place, '''0'''))
    result2 = await session.execute(getQuery(interest, place, '''50'''))
    result3 = await session.execute(getQuery(interest, place, '''100'''))
    result4 = await session.execute(getQuery(interest, place, '''150'''))

    countlist = []
    similarity_measure_businesses(result, preferences, countlist)
    similarity_measure_businesses(result2, preferences, countlist)
    similarity_measure_businesses(result3, preferences, countlist)
    similarity_measure_businesses(result4, preferences, countlist)
    countlist.sort(key=lambda tup: tup[0], reverse=True)
    new_list = [seq[1:] for seq in countlist]
    return new_list[:3]

# Then create a couroutine which will connect to your API and run all your queries as tasks.
# We use a `backoff` decorator to reconnect using exponential backoff in case of connection failure.

# @backoff.on_exception(backoff.expo, Exception, max_time=300)


async def graphql_connection(places, food_preferences, activity_preferences):
    results = []
    api_key = getAPIKey()
    # define our authentication process.
    header = {'Authorization': 'bearer {}'.format(api_key),
              'Content-Type': "application/json"}
    transport = AIOHTTPTransport(
        url="https://api.yelp.com/v3/graphql", headers=header)

    client = Client(transport=transport, fetch_schema_from_transport=True)
    async with client as session:
        for i in range(0, len(places), 2):
            spot = places[i]
            task1 = asyncio.create_task(execute_query(
                session, interests[0], spot, food_preferences[i]))
            task2 = asyncio.create_task(execute_query(
                session, interests[1], spot, activity_preferences[i]))
            if i + 1 < len(places):
                spot2 = places[i+1]
                task3 = asyncio.create_task(execute_query(
                    session, interests[0], spot2, food_preferences[i+1]))
                task4 = asyncio.create_task(execute_query(
                    session, interests[1], spot2, activity_preferences[i+1]))
                ans = await asyncio.gather(task1, task2, task3, task4)
                results.append(ans[:2])
                results.append(ans[2:])
            else:
                results.append(await asyncio.gather(task1, task2))
        return results


def get_request(place, preferences):
    food_preferences = preferences[0]
    activity_preferences = preferences[1]

    new_food_preferences = [[]] * len(food_preferences)
    new_activity_preferences = [[]] * len(activity_preferences)

    for i in range(len(new_food_preferences)):
        pref = food_preferences[i]
        pref_list = re.findall(r"[a-z]+", pref)
        for pref_word in pref_list:
            pref_word = pref_word.lower().strip()
            similar_words = get_prefs(pref_word)
            if similar_words:
                temp_list = new_food_preferences[i][:]
                temp_list += similar_words
                new_food_preferences[i] = temp_list
            temp_list = new_food_preferences[i][:]
            temp_list += [pref_word]
            new_food_preferences[i] = temp_list
            new_food_preferences[i] = list(set(new_food_preferences[i]))

    for i in range(len(new_activity_preferences)):
        pref = activity_preferences[i]
        pref_list = re.findall(r"[a-z]+", pref)
        for pref_word in pref_list:
            pref_word = pref_word.lower().strip()
            similar_words = get_prefs(pref_word)
            if similar_words:
                temp_list = new_activity_preferences[i][:]
                temp_list += similar_words
                new_activity_preferences[i] = temp_list
            temp_list = new_activity_preferences[i][:]
            temp_list += [pref_word]
            new_activity_preferences[i] = temp_list
            new_activity_preferences[i] = list(
                set(new_activity_preferences[i]))
    return asyncio.run(graphql_connection(place, new_food_preferences, new_activity_preferences))
