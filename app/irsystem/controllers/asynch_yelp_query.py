#!/usr/bin/env python3

import asyncio
import time
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

places = ['''zion''', '''grand canyon''', '''sedona''']
interests = ['''food''', '''activities''']


def getQuery(interest, place):
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


async def execute_query(session, interest, place):
    result = await session.execute(getQuery(interest, place))
    print(result)


# Then create a couroutine which will connect to your API and run all your queries as tasks.
# We use a `backoff` decorator to reconnect using exponential backoff in case of connection failure.

# @backoff.on_exception(backoff.expo, Exception, max_time=300)
async def graphql_connection():

    api_key = "cnLXWAkkm24bIO09xAVZv9IPWhXo7TJwSjNKU7EZ2LdzBc8EwGC1gs6eP5-sn-u5Vt-6mzEBK_szWjk4NWDRYv-sC-AO43cFjp-Z_K7Up652-upZ4JB-GinH9pVvYHYx"

    # define our authentication process.
    header = {'Authorization': 'bearer {}'.format(api_key),
              'Content-Type': "application/json"}
    transport = AIOHTTPTransport(
        url="https://api.yelp.com/v3/graphql", headers=header)

    client = Client(transport=transport, fetch_schema_from_transport=True)
    async with client as session:
        for spot in places:
            task1 = asyncio.create_task(
                execute_query(session, interests[0], spot))
            task2 = asyncio.create_task(
                execute_query(session, interests[1], spot))

        await asyncio.gather(task1, task2)

start = time.time()
asyncio.run(graphql_connection())
end = time.time()
print(end-start)
