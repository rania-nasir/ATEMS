
"use client";
import { Card } from "keep-react";

const WhoPage = () => {
    return (
        <>
            <header className="App-header">
                <p className='text-lg m-4 pb-2'>
                    WHO IS THERE?
                </p>
                <button type="button" class=" m-2 p-4 font-medium rounded-lg text-sm">
                    <Card className="md:p-6 p-5 max-w-lg border-black hover:border-green-500">
                        Faculty
                    </Card>
                </button>
                <button type="button" class="font-medium rounded-lg text-sm">
                    <Card className="md:p-6 p-5 max-w-lg border-black hover:border-green-500">
                        Student
                    </Card>
                </button>
            </header>
        </>
    )
}

export default WhoPage;