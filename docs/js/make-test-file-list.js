function makeTestFileList() {
fetch('test-file-names.txt').then(res=>{if(res.ok){return res.text()}else{throw new Error('ファイル取得失敗！')}}).then(text=>{
    console.log(text)
    const lis = text.split('\n').filter(v=>v.trim()).map(line=>{
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.href = `test/${line}`
        a.textContent = line
        li.append(a)
        return li
    })
    const ul = document.createElement('ul')
    ul.append(...lis)
    document.querySelector(`#test-file-list`).append(ul)
})
/*
fetch('test-file-names.txt').then(res=>{
    console.log(res)
    res.text(text=>{
        console.log(text)
        const lis = text.split('\n').map(line=>{
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.href = `test/${line}`
            a.textContent = line
            li.append(a)
            return li
        })
        const ul = document.createElement('ul')
        ul.append(...lis)
        document.querySelector(`#test-file-list`).append(ul)
    }).catch((e)=>{console.error(e)})
}).catch((e)=>{console.error(e)})
*/
}
