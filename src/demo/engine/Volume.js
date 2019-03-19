/**
 * @fileOverview Volume
 * @author Epam
 * @version 1.0.0
 */


// ********************************************************
// Imports
// ********************************************************

import React from 'react';

// import LoadResult from './LoadResult';
import LoaderKtx from './loaders/LoaderKtx';
import LoaderNifti from './loaders/LoaderNifti';
import LoaderDicom from './loaders/LoaderDicom';

// ********************************************************
// Const
// ********************************************************

// ********************************************************
// Class
// ********************************************************

/**
 * Class Volume  some text later...
 */
class Volume extends React.Component {
  /**
   * @param {object} props - props from up level object
   */
  constructor(props) {
    super(props);
    this.m_xDim = 0;
    this.m_yDim = 0;
    this.m_zDim = 0;
    this.m_bytesPerVoxel = 0;
    this.m_dataArray = null;
    this.m_dataSize = 0;
    this.m_boxSize = {
      x: 0.0, y: 0.0, z: 0.0
    };
  }
  createEmptyBytesVolume(xDim, yDim, zDim) {
    this.m_xDim = xDim;
    this.m_yDim = yDim;
    this.m_zDim = zDim;
    const xyzDim = xDim * yDim * zDim;
    this.m_bytesPerVoxel = 1;
    this.m_dataArray = new Uint8Array(xyzDim);
    this.m_dataSize = xyzDim;
    this.m_boxSize = {
      x: xDim, y: yDim, z: zDim
    };
    for (let i = 0; i < xyzDim; i++) {
      this.m_dataArray[i] = 0;
    }
  }
  //
  // Make each volume texture size equal to 4 * N
  //
  makeDimensions4x() {
    const xDimNew = (this.m_xDim + 3) & (~3);
    const yDimNew = (this.m_yDim + 3) & (~3);
    const zDimNew = (this.m_zDim + 3) & (~3);
    if ((this.m_xDim === xDimNew) && (this.m_yDim === yDimNew) && (this.m_zDim === zDimNew)) {
      return; // do nothing
    } // if new size the same as current
    // perfom convert adding black pixels
    console.log(`Volume. makeDimensions4x. Convert into ${xDimNew}*${yDimNew}*${zDimNew}`);
    const xyzDimNew  = xDimNew * yDimNew * zDimNew;
    const datArrayNew = new Uint8Array(xyzDimNew);
    let i;
    for (i = 0; i < xyzDimNew; i++) {
      datArrayNew[i] = 0;
    }
    const xyDim = this.m_xDim * this.m_yDim;
    for (let z = 0; z < this.m_zDim; z++) {
      const zOff = z * xyDim;
      const zOffDst = z * xDimNew * yDimNew;
      for (let y = 0; y < this.m_yDim; y++) {
        const yOff = y * this.m_xDim;
        const yOffDst = y * xDimNew;
        for (let x = 0; x < this.m_xDim; x++) {
          const off = x + yOff + zOff;
          const val = this.m_dataArray[off];
          const offDst = x + yOffDst + zOffDst;
          datArrayNew[offDst] = val;
        } // for (x)
      } // for (y)
    } // for (z)
    this.m_xDim = xDimNew;
    this.m_yDim = yDimNew;
    this.m_zDim = zDimNew;
    this.m_dataArray = datArrayNew;
    this.m_dataSize = xyzDimNew;
  } // end
  //
  // Read from KTX format
  //
  readFromKtx(arrBuf, callbackProgress, callbackComplete) {
    const loader = new LoaderKtx();
    const ret = loader.readFromBuffer(this, arrBuf, callbackProgress, callbackComplete);
    return ret;
  } // end readFromKtx
  //
  // Read from KTX by URL
  //
  readFromKtxUrl(strUrl, callbackProgress, callbackComplete) {
    const loader = new LoaderKtx();
    const ret = loader.readFromUrl(this, strUrl, callbackProgress, callbackComplete);
    return ret;
  }
  //
  // Read from local nifti
  //
  readFromNifti(arrBuf, callbackProgress, callbackComplete) {
    const loader = new LoaderNifti();
    const ret = loader.readFromBuffer(this, arrBuf, callbackProgress, callbackComplete);
    return ret;
  }
  //
  // Read from local dicom
  //
  readFromDicom(arrBuf, callbackProgress, callbackComplete) {
    const loader = new LoaderDicom();
    const ret = loader.readFromBuffer(this, arrBuf, callbackProgress, callbackComplete);
    return ret;
  }
  readSingleSliceFromDicom(loader, indexFile, fileName, ratioLoaded, arrBuf, callbackProgress, callbackComplete) {
    const ret = loader.readFromBuffer(indexFile, fileName, ratioLoaded, this, arrBuf, callbackProgress, callbackComplete);
    return ret;
  }
  // do nothing. But we need to implement render() to run Volume tests
  render() {
    return <p>></p>;
  }
} // end class Volume

export default Volume;