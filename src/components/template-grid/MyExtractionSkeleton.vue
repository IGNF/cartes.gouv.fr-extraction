<template>
    <div class="fr-container">
        <div class="fr-grid-row">

            <div class="fr-col-3">
                <slot name="left-column">
                </slot>
            </div>
            <div class="fr-col-9">
                <slot name="main-column">
                </slot>
            </div>
        </div>
    </div>
</template>