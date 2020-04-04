export default {
    filters: {
        invoiceNumber(value) {
            if (value.indexOf('|') != -1) {
                value = value.split('|');
                value = value[0] + ' <a href="' + value[2] + '">\
                    <i class="fi-page-pdf"></i>\
                    </a> ' + value[1];
            }
            return value;
        }
    }
}