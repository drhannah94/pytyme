import timeit
import plotly.graph_objs as go

def comparison(snakes, width, number=10000):
	print(snakes)

	times = []
	for key, snake in snakes.items():
		snake = snake.strip()
		if isinstance(snake, str) and snake != '':
			times.append(timeit.timeit(snake, number=number))

	print(f'times = {times}')

	fig = go.Figure(
		data=[
			go.Bar(
				x=list(snakes.keys()),
				y=times,
			)
		]
	)

	fig.update_layout(
		height=500,
		width=width - 275,
		title="Time"
	)

	return fig.to_html()