
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef, useState } from 'react';


// Ref: https://www.youtube.com/watch?v=AbU5AYIOeU0&t=20s

const Fabric = () => {
  const { editor, onReady } = useFabricJSEditor();

  const inputRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [prevImage, setPrevImage] = useState(null);
  const [isBlur, setBlur] = useState(true);
  const [advice, setAdvice] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  const [canvasCount, setCanvasCount] = useState(1);
  const [canvasImages, setCanvasImages] = useState([null, null, null, null]);



//   const onAddCircle = () => {
//     editor.addCircle();
//   };

//   const onAddRectangle = () => {
//     const rect = new fabric.Rect({
//       width: 100, // Example width
//       height: 50, // Example height
//       fill: 'green', // Example fill color
//       stroke: 'blue', // Example stroke color
//       strokeWidth: 2, // Example stroke width
//       cornerRadius: 10 // Example corner radius
//     });
  
//     editor.canvas.add(rect);
//   };

//   const onRemoveCircle = () =>{
//     const activeObject = editor.canvas.getActiveObject();
//     if (activeObject && activeObject.type === 'circle') {
//       editor.canvas.remove(activeObject);
//     }
//   };

//   const onRemoveRectangle = () =>{
//     const activeObject = editor.canvas.getActiveObject();
//     if (activeObject && activeObject.type === 'rect') {
//       editor.canvas.remove(activeObject);
//     }
//   };

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
    editor.canvas.centerObject(oImg);
    
    // Previsualizar en el modal
    const img = new Image();
    img.onload = () => { 
    const updatedCanvasImages = [...canvasImages];
    updatedCanvasImages[canvasCount - 1] = oImg; // Almacena la imagen en el estado
    setCanvasImages(updatedCanvasImages);
    }
  });
};

// //Insertar imagenes de los productos
// const handleImg = (imageUrl) => {
//   const img = new Image(); // Crea un nuevo objeto Image
//   img.onload = () => { // Cuando la imagen se haya cargado completamente
//     const updatedCanvasImages = [...canvasImages];
//     updatedCanvasImages[canvasCount - 1] = img; // Almacena la imagen en el estado
//     setCanvasImages(updatedCanvasImages);
//   };
//   img.src = imageUrl; // Asigna la URL de la imagen al objeto Image
// };

    //Descargar la imagen
    const downloadImg = () => {
        // Establecer nuevas dimensiones para el lienzo
        const dataURL = editor.canvas.toDataURL();
        const link = document.createElement('a');
        link.download = "image.png";
        link.href = dataURL;
        link.click();
      }
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
          setCanvasCount(prevCount => prevCount + 1); // Incrementa el contador de canvas
       }
      };
      
      const deleteCanvas = () => {
          if (canvasCount > 1){
          setCanvasCount(prevCount => prevCount - 1);
        }
      };
      
      // Agregar textboxes al producto
      const addTextbox = () => {
          const textbox = new fabric.Textbox('Insert text here', {
            left: 50,
            top: 50,
            width: 100,
            fontSize: 15,
            fill: 'black', // Color del texto
          });
          editor.canvas.add(textbox);
      }

      useEffect(() => {
        if (editor && editor.canvas) {
          const dataURL = editor.canvas.toDataURL();
          const prevImg = new Image();
          prevImg.src = dataURL;
          
          setPrevImage(prevImg); // Actualizamos el estado con el nuevo array
          localStorage.setItem('prevImage', JSON.stringify(prevImg)); // Guardamos el nuevo array en localStorage
        }
      }, [modal, editor, canvasCount]); // Agrega modal, editor y canvasCount como dependencias


  return (
  <> 
    {
      advice &&
      <div className='fixed h-screen w-screen z-10'>
        <div className='flex flex-col items-center justify-between absolute h-[500px] w-[800px] border-4 border-double border-blue-700 top-[150px] right-[600px]'>
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

                <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={addTextbox}>
                  Add Text
                </button>
                <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={onRemoveImage}>
                  Remove Image
                </button>
            </div>

            <div className='flex justify-center'>
                <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={handleModal}>
                  Preview de imagen
                </button>
            </div>            

            <div className='flex w-full justify-around mt-10 '>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/playeraDemo.png")}>
                <img className='w-20 h-14' src="/playeraDemo.png" alt="Demo1" />
              </button>
              <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/Demo2.png")}>
                <img className='w-20 h-14' src="/Demo2.png" alt="Demo2" />
              </button>
            </div>

          </div>
    </div>

      {
          modal &&
          <div className='fixed h-screen w-screen'>
            <div className='flex flex-col absolute h-[500px] w-[800px] border-4 border-double border-blue-700 bottom-[1190px] z-50 right-[580px]'>
                  {prevImage && <img src={prevImage.src} alt='preview de la imagen /'></img>}
                  <div className='flex justify-center gap-4'>
                  <button className='absolute top-0 right-0 w-[50px] h-[50px]' onClick={handleModal}>
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
                  <div className={"flex justify-evenly" }>  
                      <button className={`border-2 p-2 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`} onClick={downloadImg}>
                        Descargar imagen
                      </button>
                      <button
                        onClick={handleModal} 
                        className={`border-2 p-2 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`}>
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
      

