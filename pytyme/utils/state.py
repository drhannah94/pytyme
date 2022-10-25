 

class State:
 	def __init__(self, session, app_name):
 		self.session = session
 		self.app_name = app_name
 		self.init_state()

 	def init_state(self):
 		if self.app_name not in self.session:
 			print('init_state')
 			self.session[self.app_name] = {
 				'js': {},
 				'vs': {},
 				'bs': {}
 			}

 	def set_state(self, key, val):
 		if isinstance(key, str):
 			self.session[self.app_name][key] = val
 		elif isinstance(key, list):
 			self.session[self.app_name][key[0]][key[1]] = val
 		else:
 			raise ValueError(f'Error: Invalid key type. Expected list or string but received {type(key)} instead.')

 	def get_state(self):
 		return {
 			'js': self.session[self.app_name]['js'], 
 			'vs': self.session[self.app_name]['vs'],
 			'bs': self.session[self.app_name]['bs'],
 		}