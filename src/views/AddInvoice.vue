<template>
    <div>
        <h3><i class="fi-plus"></i> {{$t("new invoice")}}</h3>

        <div class="row">
            <div class="column small-12 large-6">
                <label for="storage-id">{{$t("storage")}}</label>
                <select name="storage_id" id="storage-id">
                    <option value="">--- válassz ---</option>
                    <option value="5">Fő u 38</option>
                    <option value="6">Iroda</option>
                </select>
            </div>
            <div class="column small-12 large-6">{{$t("invoice type")}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddInvoice',
}
</script>

<style scoped>

</style>