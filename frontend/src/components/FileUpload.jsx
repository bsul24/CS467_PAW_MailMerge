import React from 'react';

export default function FileUpload(){

    return (<div className='file-upload'>
            <label className='file-upload-label' htmlFor='file-upload-real'>Upload CSV</label>
            <input id='file-upload-real' className='file-upload-real' type='file' accept='.csv'></input>
            <span className='file-upload-name'>No file chosen</span>
        </div>)

}