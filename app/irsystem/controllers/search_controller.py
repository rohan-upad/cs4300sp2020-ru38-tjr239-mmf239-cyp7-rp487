from . import *  
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.controllers import asynch_yelp_query as yelp_query

project_name = "Road Trip Recommender"
net_id = "Rohan Upadhyayula: ru38 Timothy Reeves: tj3239 Maddie Franke: mmf239 Cindy Pan: cyp7"

@irsystem.route('/', methods=['GET'])
def search():
	query = request.args.get('search')
	if not query:
		data = []
		output_message = ''
	else:
		output_message = "Your search: " + query
		data = range(5)
	return render_template('search.html', name=project_name, netid=net_id, output_message=output_message, data=data)



