
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef, useState } from 'react';


// Ref: https://www.youtube.com/watch?v=AbU5AYIOeU0&t=20s

const Fabric = () => {
  const { editor, onReady } = useFabricJSEditor();

  const inputRef = useRef(null);

  const [modal, setModal] = useState(false);
  const [prevImage, setprevImage] = useState(null);
  const [isBlur, setBlur] = useState(true);
  const [advice, setAdvice] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);

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

  const onRemoveImage = () =>{
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      editor.canvas.remove(activeObject);
    }
  };

  const handleLogo = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    
    fabric.Image.fromURL(url, (oImg) => {
      oImg.scale(0.1).set('flipX', true);
      editor.canvas.add(oImg);
    inputRef.current.value = null;
    });
  };

  const handleImg = (imageUrl) => {
    fabric.Image.fromURL(imageUrl, (oImg) => {
      oImg.scale(0.2).set('flipX', true);
      editor.canvas.add(oImg);
    });
  };

    const downloadImg = () => {
        // Establecer nuevas dimensiones para el lienzo
        const dataURL = editor.canvas.toDataURL();
        const link = document.createElement('a');
        link.download = "image.png";
        link.href = dataURL;
        link.click();
      }
      const handleModal = () => {
        if(modal === false){
          setBlur(true)
          setModal(true)
        }else{
          setBlur(false)
          setModal(false)
        }
        console.log("Modal: " + modal)
      }
  
      const handleAdvice = () => {
        if(advice === true){
          setAdvice(false)
          setBlur(false)
        }else{
          setAdvice(true)
        }
      }

      const handleAgree = () => {
        if (isAgree === false){
          setIsAgree(true)
        }else{
          setIsAgree(false)
        }
      }

    useEffect(() => {
      if (editor && editor.canvas) {
        const dataURL = editor.canvas.toDataURL();
        const prevImg = new Image();
        prevImg.src = dataURL;
        setprevImage(prevImg); // Actualiza la imagen previa cuando cambia el estado modal
        localStorage.setItem('prevImg', JSON.stringify(prevImg)); // Guarda la imagen previa en localStorage
      }
    }, [modal, editor]); // Agrega modal y editor como dependencias

  return (
  <> 
    {
      advice &&
      <div className='fixed h-screen w-screen z-10'>
        <div className='flex flex-col items-center justify-between absolute h-[500px] w-[800px] border-4 border-double border-blue-700 top-[90px] right-[370px]'>
              <h1>Recomendaciones de imagen</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eos earum omnis voluptates inventore at ipsam iste modi fuga vel cupiditate delectus reiciendis veniam voluptatum, quam pariatur ipsa quos ratione? Officiis architecto hic eligendi magnam, modi error veritatis eius facere repellendus, inventore sit mollitia omnis non ea, magni consectetur ab!</p>
              <button className='border-2' onClick={handleAdvice}>
                Cerrar
              </button>
        </div>
      </div>
      }

    <div className={`h-screen w-screen flex flex-row gap-20 justify-center items-center ${isBlur ? "blur": ""}`} >
      <div className='flex justify-center items-center w-3/6 h-3/6 border-2 border-green-700 relative'>

          {/* <img className='h-full' src="/playeraDemo.png" alt="PLAYERA DEMO" /> */}
          <div className='flex items-center justify-center h-full w-full rounded border-2 border-dotted border-red-500 overflow-hidden absolute'>
            <FabricJSCanvas  className='canvasT' onReady={onReady} />
          </div>
      </div>

    <div className='flex flex-col justify-between h-3/6 items-center'> 
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
            <div className='flex flex-col absolute h-[500px] w-[800px] border-4 border-double border-blue-700 bottom-[890px] z-50 right-[380px]'>
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
                      <button className={`border-2 p-2 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`}>
                        Comprar Ahora
                      </button>
                      <button className={`border-2 p-2 border-green-600 hover:border-black text-black ${isAgree ? '' : 'disabled'}`}>
                        Agregar a carrito
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
      


