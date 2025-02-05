#!/usr/bin/env python3
import asyncio
import time 
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport


async def query():
    api_key = "6pbvkg-r5El8vFNEci4AF7MPBRUTrG-BQ-gqhwwdQgWeFPBGbUWCXUdZaqULhTBJeCcLk2d1e3vjP_A3BXFVoPHRSrn6D3jEvHZRwKgIdz1Ct6QSPBUhkBanOXtvYHYx"

    # define our authentication process.
    header = {'Authorization': 'bearer {}'.format(api_key),
            'Content-Type': "application/json"}

    transport = AIOHTTPTransport(url="https://api.yelp.com/v3/graphql", headers=header)

    # Using `async with` on the client will start a connection on the transport
    # and provide a `session` variable to execute queries on this connection
    async with Client(
        transport=transport, fetch_schema_from_transport=True,
    ) as session:

        # Execute single query
        place = '''zion'''
        interest = '''food'''
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
        start = time.time()
        result = await session.execute(query)
        end = time.time()
        print(result)
        print(end-start)




asyncio.run(query())
asyncio.run(query())