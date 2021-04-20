#!/usr/bin/env python3

import asyncio
import time 
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

#places = ['''zion''','''grand canyon''','''sedona''']
interests = ['''food''','''activities''']

def getQuery(interest,place):
    query = gql('''{
        search(term:"''' + interest + '''",
            location:"''' + place + '''",
            radius: 40000,
            limit: 50) {
                total
                business {
                    name
                    alias
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
    result = await session.execute(getQuery(interest,place)) 
    countlist = []
    for business in range(50):
        counter = 0
        merged_reviews = ""
        for review in range(len(result['search']['business'][business]['reviews'])):
            merged_reviews += result['search']['business'][business]['reviews'][review]['text']
        for pref in preferences:
            counter+= merged_reviews.count(pref)
        countlist.append((counter, result['search']['business'][business]['name']))
    countlist.sort(key=lambda tup: tup[0], reverse=True)
    new_list = [ seq[1] for seq in countlist]
    return new_list[:3]

# Then create a couroutine which will connect to your API and run all your queries as tasks.
# We use a `backoff` decorator to reconnect using exponential backoff in case of connection failure.

#@backoff.on_exception(backoff.expo, Exception, max_time=300)
async def graphql_connection(places, preferences):
    results = []
    api_key = "6pbvkg-r5El8vFNEci4AF7MPBRUTrG-BQ-gqhwwdQgWeFPBGbUWCXUdZaqULhTBJeCcLk2d1e3vjP_A3BXFVoPHRSrn6D3jEvHZRwKgIdz1Ct6QSPBUhkBanOXtvYHYx"

    # define our authentication process.
    header = {'Authorization': 'bearer {}'.format(api_key),
            'Content-Type': "application/json"}
    transport = AIOHTTPTransport(url="https://api.yelp.com/v3/graphql", headers=header)

    client = Client(transport=transport, fetch_schema_from_transport=True)
    async with client as session:
        for spot in places:
            task1 = asyncio.create_task(execute_query(session,interests[0],spot, preferences)) 
            task2 = asyncio.create_task(execute_query(session,interests[1],spot, preferences)) 

            results.append(await asyncio.gather(task1, task2))
        return results

def get_request(place, preferences):
    print(place)
    print(preferences)
    return asyncio.run(graphql_connection(place, preferences))
