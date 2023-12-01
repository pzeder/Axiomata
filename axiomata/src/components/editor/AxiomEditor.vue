<template>
    <div class="backdrop"/>
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div class="sequence-editors"> 
                <div> uppder sequence </div>   
                <div> lower sequence </div> 
            </div>
            <div> SymbolAlphabet </div>
        </div>
    </div>
</template>

<style>
.axiom-editor-screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
}

.axiom-editor {
    display: flex;
    place-items: center;
}
</style>