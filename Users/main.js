//AJAX:
const url = 'https://jsonplaceholder.typicode.com'; 

class CustomHttp {
	get(url, callback) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.send();
		xhr.addEventListener('load', () => callback(xhr.responseText));
	}
}

const httpClient = new CustomHttp();

httpClient.get(`${url}/users`, (response) => {
	let users = JSON.parse(response);

	users.forEach( (item) => {
		const template = `<tr><td data-id=${item.id}>${item.name} <button type="button" class="btn btn-info">See Profile</button></td></tr>`;
	    document.querySelector('#users tbody').insertAdjacentHTML('beforeend', template);
	} );

	let table = document.querySelector('table');
	table.addEventListener('click', (e) => {
		e.preventDefault();
		if (e.target.classList.contains('btn-info')) {
			const dataId = +e.target.closest('td').dataset.id;
			showUserDetails(dataId);
		}
	});

	function showUserDetails(dataId) {
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === dataId) {
				document.querySelector('#details-block').innerHTML = '';
				let tableWithDetails = `
					<table class="table table-bordered">
						<thead class="thead-light">
							<tr>
								<th>Details about:<mark> ${users[i].name} </mark></th>
							</tr>
						</thead>
						<tbody>
				`;

				for (let key in users[i]) {
					if (typeof users[i][key] !== 'object') {
						tableWithDetails += `
						<tr>
							<td>${key}: ${users[i][key]}</td>
						</tr>
						`	
					} else {
						tableWithDetails += `
							<tr>
							<td class="bg-info"><a class="card-link"  data-toggle="collapse"  href="#${key}">
							<mark> ${key} </mark> *press here to see/hide all details
							</a></td>
							</tr>
						`	
						for (let deepKey in users[i][key]) {
							if (deepKey === 'geo'){
								console.log("geo is to secret info");
							} else {
								tableWithDetails += `
								<tr id="${key}" class="collapse">
								<td class="text-info">${deepKey}: ${users[i][key][deepKey]}</td>
								</tr>
								`	
							}					
						}
					}
				};
					
				tableWithDetails += `
						</tbody>
					</table>
				`;
				document.querySelector('#details-block').insertAdjacentHTML('afterbegin', tableWithDetails);	
				break;			
			}
		}
	}
});