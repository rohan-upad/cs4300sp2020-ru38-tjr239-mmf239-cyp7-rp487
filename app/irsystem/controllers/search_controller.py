from . import *  
from app.irsystem.controllers.async_yelp_query import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
import json
import requests

project_name = "Road Trip Recommender"
net_id = "Rohan Upadhyayula: ru38 Timothy Reeves: tj3239 Maddie Franke: mmf239 Cindy Pan: cyp7 Rishi Penmetcha: rp487"

@irsystem.route('/search', methods=['GET'])
def search():
	user_input = json.loads(request.args.get('input'))
	print('USER INPUT')
	print(user_input)
	locations = list(map(lambda inp: inp['location'], user_input))
	food_prefs = list(map(lambda inp: inp['food'], user_input))
	activity_prefs = list(map(lambda inp: inp['activities'], user_input))
	preferences = (food_prefs, activity_prefs)
	output = {}

	if not locations:
		data = []
		output = {}
	else:
		[
			'', ''
		]
		data = get_request(locations, preferences)
		print(data)

		for i in range(len(locations)):
			location = locations[i]
			recs = [(data[i][0]), (data[i][1])]
			output[location] = recs

	return output

@irsystem.route('/', methods=['GET'])
def index():
    return render_template("index.html")