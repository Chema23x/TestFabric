
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef, useState } from 'react';


// Ref: https://www.youtube.com/watch?v=AbU5AYIOeU0&t=20s

const Fabric = () => {
  const { editor, onReady } = useFabricJSEditor();

  const inputRef = useRef(null);

  const [modal, setModal] = useState(false);
  const [prevImage, setprevImage] = useState(null);
  const [isBlur, setBlur] = useState(false);

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
      oImg.scale(0.2).set('flipX', true);
      editor.canvas.add(oImg);
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

    useEffect(() => {
      if (editor && editor.canvas) {
        const dataURL = editor.canvas.toDataURL();
        const prevImg = new Image();
        prevImg.src = dataURL;
        setprevImage(prevImg); // Actualiza la imagen previa cuando cambia el estado modal
        localStorage.setItem('prevImg', JSON.stringify(prevImg)); // Guarda la imagen previa en localStorage
      }
    }, [modal, editor]); // Agrega modal y editor como dependencias

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

  return (
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
            {/* <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={downloadImg}>
              Descargar imagen
            </button> */}
            <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={handleModal}>
              Preview de imagen
            </button>
          </div>            
            
          {
          modal &&
          <div className='fixed h-screen w-screen'>
            <div className='absolute h-[600px] w-[800px] border-4 border-double border-blue-700 bottom-52 z-50 right-[670px]'>
                  {prevImage && <img src={prevImage.src} alt='preview de la imagen /'></img>}
                  <button onClick={handleModal}>
                    Cerrar
                  </button>
            </div>
          </div>
          }

        <div className='flex w-full justify-around mt-10 '>
          <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/playeraDemo.png")}>
            <img className='w-20 h-14' src="/playeraDemo.png" alt="Demo1" />
          </button>
          <button className='border-2 p-2 border-green-600 hover:border-black text-black' onClick={() => handleImg("/Demo2.png")}>
            <img className='w-20 h-14' src="/Demo2.png" alt="Demo2" />
          </button>
        </div>

      </div>

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
      
    </div>
  );
};

export default Fabric;


// Checar el blur