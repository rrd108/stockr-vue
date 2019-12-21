<template>
  <div class="small-12 columns content">
    <h3>{{invoice.storage.company.name}}</h3>
    <table class="vertical-table">
        <tbody>
            <tr>
                <th scope="row">{{$t("partner")}}</th>
                <td><router-link :to="'partners/' + this.invoice.partner.id">{{invoice.partner.name}}</router-link></td>
                <th scope="row">{{$t("storage")}}</th>
                <td><router-link :to="'storages/' + this.invoice.storage.id">{{invoice.storage.name}}</router-link></td>
            </tr>
            <tr>
                <th scope="row">{{$t("invoice type")}}</th>
                <td><router-link :to="'invoicetypes/' + this.invoice.invoicetype.id">{{invoice.invoicetype.name}}</router-link></td>
                <th scope="row">{{$t("date")}}</th>
                <td>{{invoice.date}}</td>
            </tr>
        <tr>
            <th scope="row">{{$t("number")}}</th>
            <td>{{invoice.number}}
                <!--?php if (strpos($invoice->number, '|')) : ?>
                    <?php $num = explode('|', $invoice->number); ?>
                    <?= $num[1] . ' ' . $this->Html->link('<i class="fi-page-pdf"></i>', $num[2], ['escape' => false]) ?>
                <?php else : ?>
                    <?= h($invoice->number) ?>
                        <?php if ($invoice->partner->group->id != 4) : ?>
                            <?= $this->Html->link('<i class="fi-page-export-pdf"> ' . __('Billingo') . '</i>', ['controller' => 'Invoices', 'action' => 'billingo', $invoice->id], ['escape' => false]) ?>
                        <?php endif; ?>
                <?php endif; ?-->
            </td>
            <th scope="row">{{$t("type")}}</th>
            <td>{{invoice.sale ?  $t("sale") : $t("purchase")}}</td>
        </tr>
        </tbody>
</table>
    <!--
        <tr>
            <th scope="row"><?= __('Currency') ?></th>
            <td><?= h($invoice->currency) ?></td>
            <th scope="row">PDF</th>
            <td><?= $this->Html->link('<i class="fi-page-export-pdf"> PDF</i>', ['controller' => 'Invoices', 'action' => 'view', $invoice->id, '_ext' => 'pdf'], ['escape' => false]) ?></td>
        </tr>
    </table>
    <div class="related">
        <?php if (!empty($invoice->items)): ?>
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr class="<?= $invoice->sale ? 'out' : 'in' ?>">
                    <th class="text-center" scope="col"><?= __('Product') ?></th>
                    <th class="text-center" scope="col"><?= __('Quantity') ?></th>
                    <th class="text-center" scope="col"><?= __('Price') ?></th>
                    <th class="text-center" scope="col"><?= __('Amount') ?></th>
                    <th class="text-center" scope="col"><?= __('VAT') ?></th>
                    <th class="text-center" scope="col"><?= __('VAT') ?></th>
                    <th class="text-center" scope="col"><?= __('Gross Amount') ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($invoice->items as $item): ?>
                <tr>
                    <td><?= h($item->product->name) ?></td>
                    <td class="text-right"><?= h($item->quantity) ?></td>
                    <td class="text-right"><?= $this->Number->format($item->price) ?></td>
                    <td class="text-right"><?= $this->Number->format($item->price * $item->quantity, ['precision' => 2]) ?></td>
                    <td class="text-right"><?= h($item->product->vat) ?>%</td>
                    <td class="text-right"><?= $this->Number->format($item->product->vat * $item->price * $item->quantity / 100, ['precision' => 2]) ?></td>
                    <td class="text-right"><?= $this->Number->format($item->price * $item->quantity * (1 + $item->product->vat / 100), ['precision' => 2]) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
            <tfoot>
                <tr>
                    <td><?= __('Total') ?></td>
                    <td class="text-right"><?= collection($invoice->items)->sumOf('quantity') ?></td>
                    <td></td>
                    <td class="text-right"><?= $this->Number->format(collection($invoice->items)->sumOf(function ($item) {
    return $item->price * $item->quantity;
}), ['precision' => 2]) ?></td>
                    <td></td>
                    <td class="text-right"><?= $this->Number->format(collection($invoice->items)->sumOf(function ($item) {
    return $item->price * $item->quantity * $item->product->vat / 100;
}), ['precision' => 2]) ?></td>
                    <td class="text-right"><?= $this->Number->format(collection($invoice->items)->sumOf(function ($item) {
    return $item->price * $item->quantity * (1 + $item->product->vat / 100);
}), ['precision' => 2]) ?></td>
                </tr>
            </tfoot>
        </table>
        <?php endif; ?>
    </div> -->
</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ViewInvoce',

    data() {
        return {
            invoice: {},
        }
    },

    created() {
        axios.get(process.env.VUE_APP_API_URL + 'invoices/' + this.$route.params.id + '.json?company=' + this.$store.state.company.id + '&ApiKey=' + this.$store.state.user.api_token)
        .then(response => {
            this.invoice = response.data.invoice
        })
        .catch(err => console.error(err))
    },
}
</script>

<style>

</style>