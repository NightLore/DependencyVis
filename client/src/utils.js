
function _getDocumentWidth() {
   return document.body.clientWidth
       || document.documentElement.clientWidth;
}

function _getDocumentHeight() {
   return document.body.clientHeight
       || document.documentElement.clientHeight;
}

function getDocumentSize() {
   return {
      width: _getDocumentWidth(),
      height: _getDocumentHeight()
   };
}

export {
   getDocumentSize
};
