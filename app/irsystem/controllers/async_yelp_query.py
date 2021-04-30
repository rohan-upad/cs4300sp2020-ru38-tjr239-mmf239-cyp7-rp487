#!/usr/bin/env python3

import asyncio
import time 
import json
import random
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

interests = ['''food''','''activities''']

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

def getQuery(interest,place, offset):
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
                        rating
                    }
                }
            }
        }
    ''')
    return query

async def execute_query(session, interest, place, preferences):
    result = await session.execute(getQuery(interest,place,'''0''')) 
    result2 = await session.execute(getQuery(interest,place,'''50'''))
    countlist = []
    for business in range(len(result['search']['business'])):
        counter = 0
        merged_reviews = ""
        merged_reviews += result['search']['business'][business]['name']
        for review in range(len(result['search']['business'][business]['reviews'])):
            merged_reviews += result['search']['business'][business]['reviews'][review]['text']
        for categories in range(len(result['search']['business'][business]['categories'])):
            merged_reviews += " " + result['search']['business'][business]['categories'][categories]['title']
        for pref in preferences:
            counter+= merged_reviews.count(pref)
        countlist.append((counter, result['search']['business'][business]['name'], result['search']['business'][business]['url']))
    for business in range(len(result2['search']['business'])):
        counter = 0
        merged_reviews = ""
        merged_reviews += result['search']['business'][business]['name']
        for review in range(len(result2['search']['business'][business]['reviews'])):
            merged_reviews += result2['search']['business'][business]['reviews'][review]['text']
        for categories in range(len(result2['search']['business'][business]['categories'])):
            merged_reviews += " " + result2['search']['business'][business]['categories'][categories]['title']
        for pref in preferences:
            counter+= merged_reviews.count(pref)
        denom = len(merged_reviews.split(' ')) + 1 + len(preferences)
        countlist.append((counter/denom, result2['search']['business'][business]['name'], result2['search']['business'][business]['url']))
    countlist.sort(key=lambda tup: tup[0], reverse=True)
    new_list = [seq[1:] for seq in countlist]
    return new_list[:3]

# Then create a couroutine which will connect to your API and run all your queries as tasks.
# We use a `backoff` decorator to reconnect using exponential backoff in case of connection failure.

#@backoff.on_exception(backoff.expo, Exception, max_time=300)
async def graphql_connection(places, preferences):
    results = []
    api_key = getAPIKey()
    # define our authentication process.
    header = {'Authorization': 'bearer {}'.format(api_key),
            'Content-Type': "application/json"}
    transport = AIOHTTPTransport(url="https://api.yelp.com/v3/graphql", headers=header)

    client = Client(transport=transport, fetch_schema_from_transport=True)
    async with client as session:
        for i in range(0,len(places),2):
            spot = places[i]
            task1 = asyncio.create_task(execute_query(session,interests[0],spot,preferences[0])) 
            task2 = asyncio.create_task(execute_query(session,interests[1],spot,preferences[1])) 
            if i + 1 < len(places):
                spot2 = places[i+1]
                task3 = asyncio.create_task(execute_query(session,interests[0],spot2,preferences[0])) 
                task4 = asyncio.create_task(execute_query(session,interests[1],spot2,preferences[1])) 
                ans = await asyncio.gather(task1, task2, task3, task4)
                results.append(ans[:2])
                results.append(ans[2:])
            else:
                results.append(await asyncio.gather(task1, task2))
        return results

def get_request(place, preferences):
    new_preferences = [[],[]]
    for pref in preferences[0]:
        similar_words = get_prefs(pref)
        if similar_words:
            new_preferences[0].extend(similar_words)
    for pref in preferences[1]:
        similar_words = get_prefs(pref)
        if similar_words:
            new_preferences[1].extend(similar_words)
    new_preferences[0].extend(preferences[0])
    new_preferences[1].extend(preferences[1])
    # new_preferences = list(set(new_preferences))
    return asyncio.run(graphql_connection(place, new_preferences))


