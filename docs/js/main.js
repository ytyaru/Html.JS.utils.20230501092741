window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    makeTestFileList()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

