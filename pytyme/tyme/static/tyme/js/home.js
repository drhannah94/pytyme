$(document).ready(function() {
	$('#loading').hide();

	if (Object.keys(context.code).length > 0) {
		populateSnippets();
	} else {
		codeMirrorInit('py-code-mirror-1');
	}
});

$('#add-snippet').click(function () {
	var snippets = $('.card');
	var num = snippets.length + 1;
	addSnippet(num);
});

$('#iterations').change(function () {
	var position = $(this).val();
	console.log('position = ', position);
	var val = sliderToLog(position);

	console.log('val = ', val);

	$('#iterations-label').text(`${val} Iterations`);
});

$('#run-snippets').click(function () {
	$('#loading').show();

	var width = $('#plot').width();
	let code = {};

	$('.CodeMirror').each(function() {
		console.log('this', this);
		var id = $(this).parent().parent().find('.card-tile').text();

		console.log('id = ', id);
		code[id] = this.CodeMirror.getValue();
	});

	var data = JSON.stringify({
		'code': code,
		'width': width,
		'iterations': sliderToLog($('#iterations').val())
	});

	console.log('data = ', data);

	ajaxPOST('/compare/', data, callback=populateSnippets);
});

$('#reset-button').click(function () {
	ajaxPOST('', null);
})

function codeMirrorInit(id, val=null) {
	var config = {
		mode: 'python',
		indentUnit: 4,
		theme: 'eclipse',
		lineNumbers: true,
		lineWrapping: false,
		indentWithTabs: true,
		viewportMargin: Infinity,
	};

	var cm = CodeMirror.fromTextArea($(`#${id}`)[0], config);
	cm.setSize(null, 110);
	if (val) {
		cm.setValue(val);
	}
	cm.refresh();
}

function addSnippet(num, val=null) {
	var html = `
		<div id="snippet-${num}" class="card mt-3">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<h3 class="card-tile">Snippet ${num}</h3>
					</div>
					<div class="col">
						<div class="d-flex flex-row-reverse">
							<button onclick="deleteSnippet(this);" type="button" class="btn btn-danger">Delete</button>
						</div>
					</div>
				</div>
			<div class="card-body code">
				<textarea id="py-code-mirror-${num}"></textarea>
			</div>
		</div>
	`
	$('#code-snippets').append(html);
	codeMirrorInit(`py-code-mirror-${num}`, val);
}

function populateSnippets() {
	for (let snip in context.code) {
		var id = parseInt(snip.split(' ')[1]);
		console.log('id = ', id)
		if (id > 1) {
			addSnippet(id, context.code[snip]);
		} else {
			codeMirrorInit(`py-code-mirror-${id}`, context.code[snip]);
		}
	}
}

function sliderToLog(position) {
	// position will be between 0 and 100
	var minp = 0;
	var maxp = 100;

	// The result should be between 100 an 10000000
	var minv = Math.log(100);
	var maxv = Math.log(10000000);

	// calculate adjustment factor
	var scale = (maxv - minv) / (maxp - minp);

	return Math.trunc(Math.exp(minv + scale * (position - minp)));
}

function deleteSnippet(snippet) {
	$(snippet).parent().parent().parent().parent().parent()[0].remove();
}


function ajaxPOST(dest, data, isPageRefresh=true) {
	console.log('ajaxPOST');
	$.ajax({
		type: "POST",
		headers: {'X-CSRFToken': getCookie('csrftoken')},
		url: window.location.origin + dest,
		data: data,
		contentType: false,
		processData: false,
		success: function () {
			console.log('Success!');

			if (isPageRefresh) {
				window.location = dest;
			}

			$('#loading').hide();
		},
		error: function () {
			console.log('Error!');
			$('#loading').hide();
		}
	})
}

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break
			}
		}
	}
	return cookieValue;
}

