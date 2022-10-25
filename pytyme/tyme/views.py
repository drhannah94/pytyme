import json

from django.shortcuts import render
from utils.state import State

from .scripts import comparison

APP_NAME = 'tyme'


def home(request):
	request.session.flush()
	state = State(request.session, APP_NAME)

	js = {
		'plot_js': '',
	}

	vs = {
		'code': {},
		'width': 0,
		'iterations': 100000,
	}

	bs = {}

	state.set_state('js', js)
	state.set_state('vs', vs)
	state.set_state('bs', bs)

	print(request.session[APP_NAME])

	return render(request, 'home.html', state.get_state())

def compare(request):
	state = State(request.session, APP_NAME)
	if request.method == 'POST':
		print(f'request.body = {request.body}')

		data = json.loads(request.body)
		code = data['code']
		width = data['width']
		iterations = data['iterations']

		print(f'data = {data}')
		
		# snakes = {
		# 	'Snippet 1': '"-".join(str(n) for n in range(100))',
		# 	'Snippet 2': '"-".join([str(n) for n in range(100)])',
		# 	'Snippet 3': '"-".join(map(str, range(100)))'
		# }

		plot = comparison(code, width, iterations)

		state.set_state(['js', 'plot_js'], plot)
		state.set_state(['vs', 'code'], code)
		state.set_state(['vs', 'width'], width)
		state.set_state(['vs', 'iterations'], iterations)

	return render(request, 'home.html', state.get_state())








