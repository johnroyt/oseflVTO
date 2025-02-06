const frames = [
    {
      id: '8053672909258',
      name: 'Classic Round',
      image: 'https://evfportal.s3.amazonaws.com/FrameImages/OSELF2024/OS8010-BLU+(2024).jpg'
    },
    {
      id: '0888392486523',
      name: 'Modern Square',
      image: 'https://evfportal.s3.amazonaws.com/FrameImages/OSELF2024/OS8008-GUN+(2024).jpg'
    },
    {
      id: '8056597233958',
      name: 'Aviator Style',
      image: 'https://evfportal.s3.amazonaws.com/FrameImages/OSELF2024/OS8054-BLK+(2024).jpg'
    }
  ];
  
  // Duplicate frames to create illusion of more options
  const duplicatedFrames = [...frames, ...frames, ...frames];
  
  const params = { 
    apiKey: 'TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn',
    frame: frames[0].id,
    popupIntegration: false
  };
  
  function createFrameCards() {
    const carousel = document.querySelector('.frame-carousel');
    duplicatedFrames.forEach((frame, index) => {
      const card = document.createElement('div');
      card.className = 'frame-card';
      card.onclick = () => selectFrame(frame.id, index);
      card.innerHTML = `
        <img class="frame-image" src="${frame.image}" alt="${frame.name}">
        <h3 class="frame-title">${frame.name}</h3>
      `;
      carousel.appendChild(card);
    });
  }
  
  function selectFrame(frameId, index) {
    document.querySelectorAll('.frame-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.frame-card')[index].classList.add('selected');
    fitmixInstance.setFrame(frameId);
  }
  
  window.onload = function() {  
    window.fitmixInstance = FitMix.createWidget('fitmix-container', params, function() {
      console.log('FitmixWidget creation complete!');
      createFrameCards();
      fitmixInstance.startVto('live');
    });
  }