nodecg.Replicant('tweet').on('change', value => {
    document.getElementById('tweetUrl').textContent = `${value.tweetUrl}`;
    document.getElementById('iconUrl').src = `${value.iconUrl}`;
    document.getElementById('userName').textContent = `${value.userName}`;
    document.getElementById('userId').textContent = `${value.userId}`;
    document.getElementById('message').textContent = `${value.message}`;
    document.getElementById('imageUrl').src = `${value.imageUrl}`;
  });