import timeit
import plotly.graph_objs as go

def comparison(snakes, width, number=10000):
	print(snakes)

	if 'Setup' in snakes:
		setup = snakes['Setup']

	names, times = [], []
	for key, snake in snakes.items():
		if key != 'Setup':
			snake = snake.strip()
			if isinstance(snake, str) and snake != '':
				names.append(key)
				times.append(timeit.timeit(snake, setup=setup, number=number))

	print(f'times = {times}')

	fig = go.Figure(
		data=[
			go.Bar(
				x=names,
				y=times,
			)
		]
	)

	fig.update_layout(
		height=500,
		width=width,
		title="Time"
	)

	return fig.to_html()