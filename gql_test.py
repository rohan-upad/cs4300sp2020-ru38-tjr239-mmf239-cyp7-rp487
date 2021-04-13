# import our modules
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

api_key = "BVPfPm_aHqdVa241VGRbocCemXYajr4_QNOkrx0XfQkMqyyNALQEx-D4BH-YBRFtKt-9SuIVODiPPJffJlmgIsXAwo-5YFCCRZVZvA2i-9u2L-nJn3eGRSgc13FwYHYx"

# define our authentication process.
header = {'Authorization': 'bearer {}'.format(api_key),
          'Content-Type': "application/json"}

# Build the request framework
transport = RequestsHTTPTransport(
    url='https://api.yelp.com/v3/graphql', headers=header, use_json=True)

# Create the client
client = Client(transport=transport, fetch_schema_from_transport=True)


# define a query with a different endpoint, in this case reviews
place = '''ithaca'''
interest = '''food'''
query = gql('''{
  search(term:"''' + interest + '''",
        location:"''' + place + '''",
        radius: 40000,
        limit: 50,
        sort_by: "rating") {
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

# execute and print the query
print('-'*100)
print(client.execute(query))
