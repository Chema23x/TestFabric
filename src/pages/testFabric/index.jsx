
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation } from 'swiper/modules';


// Ref: https://www.youtube.com/watch?v=AbU5AYIOeU0&t=20s

const Fabric = () => {
  const { editor, onReady } = useFabricJSEditor();

  const inputRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [isBlur, setBlur] = useState(true);
  const [advice, setAdvice] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  const [canvasCount, setCanvasCount] = useState(1);
  const [canvasImages, setCanvasImages] = useState([null, null, null, null]);
  const [downloadImages, setDownloadImages] = useState([null,null,null,null]);
  const [colors, setColors] = useState(false);


    const handleScroll = (e) => {
      e.preventDefault();

      const delta = e.deltaY;
      const zoomFactor = 0.1; // Factor de zoom

      if (delta > 0) {
          // Si el delta es positivo, significa que el usuario está haciendo scroll hacia abajo, lo que indica zoom out
          editor.zoomOut(zoomFactor);
      } else if (delta < 0) {
          // Si el delta es negativo, significa que el usuario está haciendo scroll hacia arriba, lo que indica zoom in
          editor.zoomIn(zoomFactor);
      }
    };
    
    const onRemoveImage = () =>{ //Remover imagenes o textos, ya sea individual o en selección

      const activeSelection = editor.canvas.getActiveObjects();
      console.log(activeSelection);
      if (activeSelection && activeSelection.length > 0) { // Verificar si hay algo seleccionado
        editor.canvas.remove(...activeSelection); 
        editor.canvas.discardActiveObject(); // Deselecciona los objetos restantes
      }
    };

    //Insertar los logos
    const handleLogo = (e) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      
      fabric.Image.fromURL(url, (oImg) => {
        oImg.scale(0.1).set('flipX', true);
        editor.canvas.add(oImg);
        editor.canvas.centerObject(oImg)
        inputRef.current.value = null;
      });
    };

    //Insertar imagenes de los productos
    const handleImg = (imageUrl) => {
      fabric.Image.fromURL(imageUrl, (oImg) => {
        oImg.scale(0.2).set('flipX', true);
        editor.canvas.add(oImg);
        editor.canvas.centerObject(oImg)});
      }

    //Descargar la imagen
    
    const downloadImage = (index) => {
      const imageURL = downloadImages[index];
      if (imageURL) {
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `image_${index + 1}.png`;
        link.click();
      }
    };

      //Mostrar o cerrar el modal de visualización del producto
      const handleModal = () => {
        if(modal === false){
          setBlur(true)
          setModal(true)
        }else{
          setBlur(false)
          setModal(false)
          setIsAgree(false)
        }
        console.log("Modal: " + modal)
      }
      //Maneja el modal de recomendaciones de subida de imagen
      const handleAdvice = () => {
        if(advice === true){
          setAdvice(false)
          setBlur(false)
        }else{
          setAdvice(true)
        }
      }
      //Maneja el estado de la casilla de confirmación del preview
      const handleAgree = () => {
        if (isAgree === false){
          setIsAgree(true)
        }else{
          setIsAgree(false)
        }
      }

      //Agregar y eliminar canvas
      const createCanvas = () => {
        if (canvasCount < 4){

          const canvasImgUrl = editor.canvas.toDataURL({
            format: 'png', // El formato de imagen deseado (png, jpeg, etc.)
            quality: 1 // La calidad de la imagen (0 a 1)
          });

          const img = new Image(); // Crea un nuevo objeto Image
          img.onload = () => { // Cuando la imagen se haya cargado completamente
            const updatedCanvasImages = [...canvasImages];
            updatedCanvasImages[canvasCount - 1] = img; // Almacena la imagen en el estado
            setCanvasImages(updatedCanvasImages);
          };
          img.src = canvasImgUrl; // Asigna la URL de la imagen al objeto Image
          

          setCanvasCount(prevCount => prevCount + 1); // Incrementa el contador de canvas

          
       }
      };
      
      const deleteCanvas = () => {
          if (canvasCount > 1){
          setCanvasCount(prevCount => prevCount - 1);
        }
      };
      
      // Agregar textboxes al producto
      const addTextbox = (color) => {
        const textColor = color;
          const textbox = new fabric.Textbox('Insert text here', {
            fontFamily: "Comic Sans",
            left: 50,
            top: 50,
            width: 100,
            fontSize: 15,
            fill: textColor, // Color del texto
          });
          editor.canvas.add(textbox);
      }

      useEffect(() => {
        if (editor && editor.canvas) {

           // Convierte el lienzo a una URL de imagen para cada canvas
    
            const canvasImgUrl = editor.canvas.toDataURL({
              format: 'png', // El formato de imagen deseado (png, jpeg, etc.)
              quality: 1 // La calidad de la imagen (0 a 1)
            });

            const img = new Image(); // Crea un nuevo objeto Image
            img.onload = () => { // Cuando la imagen se haya cargado completamente
              const updatedCanvasImages = [...canvasImages];
              updatedCanvasImages[canvasCount - 1] = img; // Almacena la imagen en el estado
              setCanvasImages(updatedCanvasImages);
            };
            img.src = canvasImgUrl; // Asigna la URL de la imagen al objeto Image
            
            //Almacenar las imagenes para descargar
            const updatedDownloadImages = [...downloadImages];
            updatedDownloadImages[canvasCount - 1] = canvasImgUrl;
            setDownloadImages(updatedDownloadImages);
          }
        }, [modal, editor, canvasCount]); // Agrega modal, editor y canvasCount como dependencias


  return (
  <> 
      {
        advice &&
        <div className='fixed inset-0 flex items-center justify-center z-10'>
          <div className='flex flex-col items-center justify-between h-4/6 w-3/6 border-4 border-double border-blue-700'>
            <h1>Recomendaciones de imagen</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eos earum omnis voluptates inventore at ipsam iste modi fuga vel cupiditate delectus reiciendis veniam voluptatum, quam pariatur ipsa quos ratione? Officiis architecto hic eligendi magnam, modi error veritatis eius facere repellendus, inventore sit mollitia omnis non ea, magni consectetur ab!</p>
            <button className='border-2' onClick={handleAdvice}>
              Cerrar
            </button>
          </div>
        </div>
      }


    <div className={`h-screen w-screen flex flex-row gap-14 justify-center items-center ${isBlur ? "blur": ""}`} >

      <div className='flex flex-col justify-center items-center w-4/6 h-full'>

        <div className='border-2 border-green-700 w-4/6 h-4/6'>
          <div className={`grid border-2 w-full ${canvasCount === 1 ? "grid-row-1 h-full" : "grid-cols-2 h-3/6"}`}>
              <div className='flex items-center justify-center h-full w-full rounded border-2 border-dotted border-red-500 overflow-hidden relative' onWheel={handleScroll}>
                <FabricJSCanvas className='canvasT absolute' onReady={onReady} />
              </div>

              {(canvasCount < 5 && canvasCount > 1) && (
                  <div className='flex items-center justify-center h-full w-full rounded border-2 border-dotted border-red-500 overflow-hidden relative' onWheel={handleScroll}>
                      <FabricJSCanvas className='canvasT absolute' onReady={onReady} />
                  </div>
              )}
          </div>
          { canvasCount > 2 &&   
          <div className={`grid  border-2 w-full h-3/6 ${canvasCount === 3 ? "grid-row-1" : "grid-cols-2"}`}>
              {(canvasCount < 5 && canvasCount > 2) && (
                  <div className='flex items-center justify-center h-full w-full rounded border-2 border-dotted border-red-500 overflow-hidden relative' onWheel={handleScroll}>
                      <FabricJSCanvas className='canvasT absolute' onReady={onReady} />
                  </div>
              )}

              {(canvasCount < 5 && canvasCount > 3) && (
                  <div className='flex items-center justify-center h-full w-full rounded border-2 border-dotted border-red-500 overflow-hidden relative' onWheel={handleScroll}>
                      <FabricJSCanvas className='canvasT absolute' onReady={onReady} />
                  </div>
              )}
          </div>
          }
        </div>

            <div className='flex w-full justify-evenly mt-4'>
              <button
                onClick={createCanvas}
                className='border-2 p-2 border-green-600 hover:border-black text-black'>Crear otro canva
              </button>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={handleModal}>
                  Preview de imagen
                </button>
              <button
                onClick={deleteCanvas}
                className='border-2 p-2 border-green-600 hover:border-black text-black'
              >
                Eliminar Canva
              </button>
            </div>
        </div>

        <div className='flex flex-col justify-between w-2/6 h-3/6 items-center'> 
            <div>
              <h1 className='text-4xl font-bold text-blue-800'>Personaliza tu producto</h1>
            </div>
            <div className='flex w-full justify-center gap-4'>     
                <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => inputRef.current.click()}>
                  Set Logo
                </button>
                <input
                onChange={handleLogo}
                ref={inputRef} 
                type="file" 
                className="hidden"
                />

             
                <div className='flex flex-col gap-4'>
                    <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => colors === false ? setColors(true) : setColors(false)}>
                      Add Text
                    </button>
           
              { colors &&  
                  <div className='flex justify-center items-center h-7 border-2 rounded-sm border-blue-700'>
                      <button className='h-3/4 w-1/4 rounded-full border-2 border-black bg-white'
                      onClick={() => addTextbox('white')}>

                      </button>
                      <button className='h-3/4 w-1/4 rounded-full border-2 border-black bg-black'
                      onClick={() => addTextbox('black')}>

                      </button>
                      <button className='h-3/4 w-1/4 rounded-full border-2 border-black bg-red-600'
                      onClick={() => addTextbox('red')}>

                      </button>
                      <button className='h-3/4 w-1/4 rounded-full border-2 border-black bg-blue-600'
                      onClick={() => addTextbox('blue')}>

                      </button>
                  </div>
              }
                </div>

                <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onRemoveImage}>
                  Remove Image
                </button>
            </div>          
          
            <div className='flex w-full justify-around mt-10 '>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/playeraDemo.png")}>
                <img className='w-20 h-14' src="frente.png" alt="Demo1" />
              </button>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/ParteTrasera.png")}>
                <img className='w-20 h-14' src="/ParteTrasera.png" alt="Demo2" />
              </button>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/Lado.png")}>
                <img className='w-20 h-14' src="/Lado.png" alt="Demo2" />
              </button>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/LadoAtras.png")}>
                <img className='w-20 h-14' src="/LadoAtras.png" alt="Demo2" />
              </button>
            </div>
          
          </div>
    </div>

      {
          modal &&
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
          <div className='relative flex flex-col bg-white w-[800px] h-[500px] border-4 border-double border-blue-700 z-50'>
            <Swiper
                        pagination={{
                          type: 'fraction',
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                      >
                          {canvasImages
                          .filter(image => image !== null) // Filtrar las imágenes nulas
                          .map((image, index) => (
                            <SwiperSlide key={index} onClick={() => console.log(1)}>
                              <div className='flex items-center justify-center h-full w-full rounded overflow-hidden relative'>
                                {image && <img src={image.src} alt={`Preview ${index + 1}`} />}
                              </div>
                            </SwiperSlide>
                          ))}

            </Swiper>
  
                  <div className='flex justify-center gap-4'>
                  <button className='absolute top-0 right-0 w-[50px] h-[50px] z-10' onClick={handleModal}>
                        <i>
                          <svg className='w-full h-full text-red-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 14.59L16.59 17 12 12.41 7.41 17 6 15.59 10.59 11 6 6.41 7.41 5 12 9.59 16.59 5 18 6.41 13.41 11 18 15.59z"/>
                          </svg>
                        </i>
                      </button>
                  </div>


                  <div className='flex justify-center gap-4 mb-4'>
                      <input type="checkbox" name="confirm" id="confirm" onClick={handleAgree} />
                      <label htmlFor="confirm">¿Está de acuerdo con su personalización?</label>
                  </div>
                  <div className={"flex justify-evenly h-20" }>
                  {downloadImages.map((imageURL, index) => (
                    <div key={index}>
                      {imageURL && (
                        <button className={`border-2 p-2 h-2/3 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`} onClick={() => downloadImage(index)}>
                          Descargar Imagen {index + 1}
                        </button>
                      )}
                    </div>
                  ))}  
                      <button
                        onClick={handleModal} 
                        className={`border-2 p-2 h-2/3 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`}>
                        Continuar
                      </button>
                  </div>
                 
            </div>
          </div>
          }
    </> 
  );
};

export default Fabric;

{/* 
      <div className='flex w-3/6 justify-around mt-10 mb-10'>
        <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onAddCircle}>
            Add circle
          </button>
          <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onAddRectangle}>
            Add Rectangle
          </button>

           <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onRemoveCircle}>
            Remove circle
          </button>
          <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onRemoveRectangle}>
            Remove Rectangle
          </button>
          
      </div> */}
      

