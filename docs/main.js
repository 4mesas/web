const mainData = {'Título': 'Acerca de 4 mesas', 'Texto': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam congue tempus sodales. Nulla facilisi. Quisque eu mi non lorem condimentum pellentesque. Ut euismod nisi sit amet tincidunt consectetur. Sed tincidunt nibh neque, sit amet aliquam neque eleifend eget. Nulla bibendum eget justo sit amet ultricies. Phasellus et libero a augue euismod bibendum. Ut interdum at augue varius mollis. Pellentesque vulputate nisi nulla, id scelerisque mauris venenatis id. Vestibulum porttitor, risus vitae tincidunt lacinia, orci ipsum iaculis ipsum, in finibus urna urna quis mi. Suspendisse pulvinar, sem sit amet convallis facilisis, metus lectus molestie tellus, vel convallis massa orci non augue. Pellentesque nec metus nunc'};

const urls = {
  profiles: 'https://docs.google.com/spreadsheets/d/13YrXX0ezK9UGO6duH6UrmANeU2P0COgJbP1XFVDvkgo/export?format=csv&gid=0',
  works: 'https://docs.google.com/spreadsheets/d/13YrXX0ezK9UGO6duH6UrmANeU2P0COgJbP1XFVDvkgo/export?format=csv&gid=1697597837',
  showcase: 'https://docs.google.com/spreadsheets/d/13YrXX0ezK9UGO6duH6UrmANeU2P0COgJbP1XFVDvkgo/export?format=csv&gid=964019172',
  main: 'https://docs.google.com/spreadsheets/d/13YrXX0ezK9UGO6duH6UrmANeU2P0COgJbP1XFVDvkgo/export?format=csv&gid=1413039258',
  main_gallery: 'https://docs.google.com/spreadsheets/d/13YrXX0ezK9UGO6duH6UrmANeU2P0COgJbP1XFVDvkgo/export?format=csv&gid=101122323'
}

const data = {} // Para memoizar los datos cargados

async function setup() {
  noCanvas();
  // UN MUñEQUITO DE TRANSICIÓN MENU

  //await loadData();
  params();

  select('#about-btn').mouseClicked(()=>{
    createFullBlock(urls.main, urls.main_gallery);
  });

  select('#showcase-btn').mouseClicked(()=>{
    createHTMLBlock(urls.showcase);
  });

  select('#profiles-btn').mouseClicked(()=>{
    createGalleryBlock('Perfiles', urls.profiles);
  });

  select('#works-btn').mouseClicked(()=>{
    createGalleryBlock('Publicaciones', urls.works);
  });
}

function params() {
  const params = getURLParams();
  if (params.p === "acerca") {
    createFullBlock(urls.main, urls.main_gallery);
  } else if (params.p === "perfiles") {
    createGalleryBlock('Perfiles', urls.profiles);
  } else if (params.p === "publicaciones") {
    createGalleryBlock('Publicaciones', urls.works);
  } else if (params.p === "lo_ultimo") {
    createHTMLBlock(urls.showcase);
  } else {
    createFullBlock(urls.main, urls.main_gallery);
  }
}

async function loadCSV(path) {
  const data = await d3.csv(path).then(d => d);
  return data
}

async function createGalleryBlock(title, dataPath) {
  selectAll(".block").map(d=>d.remove());
  const block = createDiv().class('block').parent('main-content');

  createElement('h1', title).parent(block).class('block-title');
  const gallery = createDiv().class('gallery').parent(block);
  
  if (data[dataPath] === undefined) {
    data[dataPath] = await loadCSV(dataPath);
  }

  const dataList = data[dataPath];

  for (let data of dataList) {
    createGalleryElement(data, gallery);
  }
}

function createGalleryElement(data, parent) {
  const galleryDiv = createDiv('').class('gallery-div').parent(parent);
  let par = galleryDiv;
  if (data['Url']) {
    const galleryA = createA(data['Url'], '', '_blank').parent(galleryDiv);
    par = galleryA;
  }
  createImg(data['Imagen'],data['Descripción']).class('gallery-img').parent(par);
  createElement('h1',data['Nombre']).class('gallery-name').parent(par);
  createP(data['Descripción']).class('gallery-description').parent(galleryDiv);
}

async function createFullBlock(mainPath, slidePath) {
  
  if (data[mainPath] === undefined) {
    data[mainPath] = await loadCSV(mainPath);
  }

  if (data[slidePath] === undefined) {
    data[slidePath] = await loadCSV(slidePath);
  }
  
  const mainData = data[mainPath][0];
  const slideData = data[slidePath];

  let slideIndex = 0;

  selectAll(".block").map(d=>d.remove());
  const block = createDiv().class('block').parent('main-content');

  createElement('h1', mainData['Título']).parent(block).class('block-title');
  const slideDiv = createDiv('').parent(block).class('slide');

  const controlsDiv = createDiv('').parent(slideDiv).class('slide-controls');

  if (slideData.length > 1) {
    // Flechitas para cambiar la galería
    createSpan('<—').parent(controlsDiv).class('slide-btn').mouseClicked(() => {
      slideIndex = slideIndex - 1 < 0 ? slideData.length - 1 : slideIndex - 1;
      slide.attribute('src', slideData[slideIndex]['Url']);
      desc.html(slideData[slideIndex]['Descripción']);
    });
  
    createSpan('—>').parent(controlsDiv).class('slide-btn').mouseClicked(() => {
      slideIndex = slideIndex + 1 >= slideData.length ? 0 : slideIndex + 1;
      slide.attribute('src', slideData[slideIndex]['Url']);
      desc.html(slideData[slideIndex]['Descripción']);
    });
  }

  let par = slideDiv;
  if (slideData[slideIndex]['Url']) {
    const galleryA = createA(slideData[slideIndex]['Url'], '').parent(slideDiv).class('slide-link');
    par = galleryA;
  }
  const slide = createImg(slideData[slideIndex]['Imagen'], '').parent(par).class('slide-img');
  const desc = createP(slideData[slideIndex]['Descripción']).parent(par).class('slide-desc');

  createP(mainData['Texto']).parent(slideDiv).class('block-content');
}

function timer() {
  const interval = setInterval();
}

async function createHTMLBlock(dataPath) {
  if (data[dataPath] === undefined) {
    data[dataPath] = await loadCSV(dataPath);
  }

  const mainData = data[dataPath][0];

  selectAll(".block").map(d=>d.remove());
  const block = createDiv().class('block').parent('main-content');

  createElement('h1', mainData['Título']).parent(block).class('block-title');
  createDiv(mainData['Contenido']).parent(block).class('H-block');
}