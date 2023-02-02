const accept = document.querySelectorAll('.fa-square-check')

Array.from(accept).forEach(x => x.addEventListener('click', acceptUser))

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

