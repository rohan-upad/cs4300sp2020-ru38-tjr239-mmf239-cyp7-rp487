from . import *  
from app.irsystem.controllers.async_yelp_query import *
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder

project_name = "Road Trip Recommender"
net_id = "Rohan Upadhyayula: ru38 Timothy Reeves: tj3239 Maddie Franke: mmf239 Cindy Pan: cyp7 Rishi Penmetcha: rp487"

@irsystem.route('/', methods=['GET'])
def search():
	locations = request.args.get('locations')
	preferences = request.args.get('preferences')
	output = {}
	if not locations:
		data = []
		output_message = ''
		output = {}
	else:
		output_message = "Recommendations: "
		data = get_request(locations.split(", "), preferences)
		locations = locations.split(", ")
		
		for i in range(len(locations)):
			location = locations[i]
			recs = [str(data[i][0]), str(data[i][1])]
			output[location] = recs


	return render_template('search.html', name=project_name, netid=net_id, output_message=output_message, data=data, output = output)