import React from "react";

// Requiring Images/Logos
import cover from '../../Images/Thesis1-PhotoRoom.png-PhotoRoom.png'
import cover1 from '../../Images/Thesis2-PhotoRoom.png-PhotoRoom.png'
import cover2 from '../../Images/Thesis3-PhotoRoom.png-PhotoRoom.png'

const Mainsection = () =>{
    return (
        <>
            <header className="App-header p-5">
                        <div className="grid grid-cols-3 gap-0">
                            {/* <div className="grid grid-cols-3 gap-0 m-2" style={{border: '1px solid orange', borderRadius: '10px'}}> */}
                            <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <p className="text-3xl font-bold mt-2 p-2">
                                    Revolutionize Thesis Evaluation with ATEMS: <span className='text-teal-600'>Elevate Academic Excellence!</span>
                                </p>
                                <p className="text-lg p-2 pt-4 mt-10">
                                    Discover a new era in academic thesis evaluation with ATEMS. Our software redefines the entire process, combining an intuitive interface, collaborative tools, and customizable evaluations. Say goodbye to the complexities of thesis management as ATEMS ensures secure document handling, compatibility across platforms, and scalable solutions. We prioritize your academic journey, offering a robust system that not only streamlines processes but also gathers valuable feedback for continuous improvement. Elevate your thesis evaluation experience with ATEMS – where innovation meets efficiency.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 mt-10 flex justify-center items-center" >
                                <div className='col-span-1'>
                                    <img src={cover} className="App-logo" alt="logo" />
                                </div>
                                <div className='col-span-1'>
                                    <img src={cover1} className="App-logo" alt="logo" />
                                    <img src={cover2} className="App-logo" alt="logo" />
                                </div>
                            </div>
                            {/* </div> */}
                        </div>
                    </header>
        </>
    )
}

export default Mainsection;