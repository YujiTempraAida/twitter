const tweetRep = nodecg.Replicant('tweet');

tweetRep.on('change', value => {
  document.getElementById('twitter').textContent = `${value.tweetUrl}`;
});

document.getElementById('send').addEventListener('click', () => {
    const tweetUrl = document.getElementById('url').value;
    console.log(tweetUrl)
    // tweetRep.value.tweetUrl = tweetUrl;
    nodecg.sendMessage('tweetUrlMessage', tweetUrl);
    

})