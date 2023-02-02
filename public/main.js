const accept = document.querySelectorAll('.fa-square-check')

Array.from(accept).forEach(x => x.addEventListener('click', acceptUser))

function acceptUser(){
    fetch('/api/admin/verify', {
        method: 'put',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
}

