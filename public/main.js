const accept = document.querySelectorAll('.fa-square-check')
Array.from(accept).forEach(x => x.addEventListener('click', acceptUser))

const remove = document.querySelectorAll('.fa-xmark')
Array.from(remove).forEach(x => x.addEventListener('click', removeUser))

async function acceptUser(){
    const userEmail = this.parentNode.childNodes[1].innerText.split(',')[1].trim()
    try{
        const res = await fetch('/api/admin/verify', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail
            })
        })
        
        const data = await res.json()
        console.log(data)

        location.reload()
    }

    catch(err){
        console.log(err)
    }
}

async function removeUser(){
    const userEmail = this.parentNode.childNodes[1].innerText.split(',')[1].trim()
    console.log(userEmail)
    try{
        const res = await fetch('/api/admin/delete', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: userEmail
            })
        })

        const data = res.json()
        console.log(data)

        location.reload()
    }

    catch(err){
        console.log(err)
    }
}

