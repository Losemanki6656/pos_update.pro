<template>
    <a-modal :visible="visible" :centered="true" :maskClosable="false" :title="$t('common.print_invoice')" width="400px"
        @cancel="onClose">
        <div id="pos-invoice">
            <div style="max-width: 400px; margin: 0px auto" v-if="order && order.xid">
                <div class="invoice-header" style="display: flex; justify-content: center">
                    <img class="invoice-logo" style="max-width: 100px" :src="selectedWarehouse.logo_url" :alt="selectedWarehouse.name" />
                </div>
                <div class="company-details">
                    <h2 style="text-align: center">{{ selectedWarehouse.name }}</h2>
                    <p style="text-align: center" class="company-address">
                        {{ selectedWarehouse.address }}
                    </p>
                    <!-- <h4 style="margin-bottom: 0px">
                        {{ $t("common.phone") }}: {{ selectedWarehouse.phone }}
                    </h4>
                    <h4>{{ $t("common.email") }}: {{ selectedWarehouse.email }}</h4> -->
                </div>
                <div class="tax-invoice-details">
                    <h3 class="tax-invoice-title" style="text-align: center"><b>{{ $t("sales.tax_invoice") }}</b></h3>
                    <table class="invoice-customer-details">
                        <tr>
                            <td style="width: 60%">
                                {{ $t("sales.invoice") }} &nbsp;&nbsp;:
                                {{ order.invoice_number }}
                            </td>
                            <td style="width: 40%">
                                {{ $t("common.date") }} :
                                {{ formatDate(order.order_date) }}
                            </td>
                        </tr>
                        <!-- <tr>
                            <td style="width: 50%">
                                {{ $t("stock.customer") }} : {{ order.user.name }}
                            </td>
                            <td style="width: 50%">
                                {{ $t("stock.sold_by") }} : {{ order.staff_member.name }}
                            </td>
                        </tr> -->
                    </table>
                </div>
                <div class="tax-invoice-items">
                    <table style="width: 100%">
                        <thead>
                            <!-- <td style="width: 5%">#</td> -->
                            <td><b>{{ $t("common.item") }}</b></td>
                            <td>
                                <b>{{ $t("common.qty") }}</b>
                            </td>
                            <!-- <td v-if="selectedWarehouse.show_mrp_on_invoice" :style="{
                                width: selectedWarehouse.show_mrp_on_invoice
                                    ? '20%'
                                    : '20%',
                            }">
                                {{ $t("product.mrp") }}
                            </td>
                            <td :style="{
                                width: selectedWarehouse.show_mrp_on_invoice
                                    ? '20%'
                                    : '25%',
                            }">
                                {{ $t("common.rate") }}
                            </td> -->
                            <td :style="{
                                textAlign: 'right',
                            }">
                                <b>{{ $t("common.total") }}</b>
                            </td>
                        </thead>
                        <tbody>
                            <tr class="item-row" v-for="(item, index) in order.items" :key="item.xid">
                                <!-- <td>{{ index + 1 }}</td> -->
                                <td>{{ item.product.name }}</td>
                                <td>{{ item.quantity + "" + item.unit.short_name }}</td>
                                <!-- <td v-if="selectedWarehouse.show_mrp_on_invoice">
                                    {{ item.mrp ? formatAmountCurrency(item.mrp) : "-" }}
                                </td> -->
                                <!-- <td>{{ formatAmountCurrency(item.unit_price) }}</td> -->
                                <td style="text-align: right">
                                    {{ formatAmountCurrency(item.subtotal) }}
                                </td>
                            </tr>

                            <tr class="item-row-other">
                                <td :colspan="2" style="text-align: right">
                                    {{ $t("stock.order_tax") }}
                                </td>
                                <td colspan="1" style="text-align: right">
                                    {{ formatAmountCurrency(order.tax_amount) }}
                                </td>
                            </tr>
                            <tr class="item-row-other">
                                <td :colspan="2" style="text-align: right">
                                    {{ $t("stock.discount") }}
                                </td>
                                <td colspan="1" style="text-align: right">
                                    {{ formatAmountCurrency(order.discount) }}
                                </td>
                            </tr>
                            <tr class="item-row-other">
                                <td :colspan="2" style="text-align: right">
                                    {{ $t("stock.shipping") }}
                                </td>
                                <td colspan="1" style="text-align: right">
                                    {{ formatAmountCurrency(order.shipping) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tax-invoice-totals">
                    <table style="width: 100%">
                        <tr>
                            <!-- <td style="width: 30%">
                                <h3 style="margin-bottom: 0px">
                                    {{ $t("common.items") }}: {{ order.total_items }}
                                </h3>
                            </td> -->
                            <td style="width: 35%">
                                <h3 style="margin-bottom: 0px">
                                    <b>{{ $t("common.qty") }}: {{ order.total_quantity }}</b>
                                </h3>
                            </td>
                            <td style="width: 65%; text-align: center">
                                <h3 style="margin-bottom: 0px; text-align: right">
                                    <b>{{ $t("common.total") }}:
                                        {{ formatAmountCurrency(order.total) }}</b>
                                </h3>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="paid-amount-deatils">
                    <table style="width: 100%">
                        <thead>
                            <td style="width: 50%; text-align: left"><b>{{ $t("payments.paid_amount") }}</b></td>
                            <td style="width: 50%;text-align: right"><b>{{ $t("payments.due_amount") }}</b></td>
                        </thead>
                        <tbody>
                            <tr class="paid-amount-row">
                                <td style="text-align: left">{{ formatAmountCurrency(order.paid_amount) }}</td>
                                <td style="text-align: right">{{ formatAmountCurrency(order.due_amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table style="width: 100%">
                        <tr style="text-align: center">
                            <td style="width: 100%">
                                <h4 style="margin-bottom: 0px" v-if="order.order_payments">
                                    {{ $t("invoice.payment_mode") }}:
                                    <span v-for="currentOrderPayments in order.order_payments"
                                        :key="currentOrderPayments.xid" style="margin-right: 5px">
                                        {{
                                            formatAmountCurrency(
                                                currentOrderPayments.amount
                                            )
                                        }}
                                        (<span v-if="currentOrderPayments.payment &&
                                                currentOrderPayments.payment
                                                    .payment_mode &&
                                                currentOrderPayments.payment.payment_mode
                                                    .name
                                                ">
                                            {{
                                                currentOrderPayments.payment.payment_mode
                                                    .name
                                            }}
                                        </span>
                                        )
                                    </span>
                                </h4>
                                <h3 style="margin-bottom: 0px" v-else>
                                    {{ $t("invoice.payment_mode") }}: -
                                </h3>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-if="selectedWarehouse.show_discount_tax_on_invoice" class="discount-details">
                    <p>
                        {{ $t("invoice.total_discount_on_mrp") }} :
                        {{ formatAmountCurrency(order.saving_on_mrp) }}
                    </p>
                    <p>
                        {{ $t("invoice.total_discount") }} :
                        {{ order.saving_percentage }}%
                    </p>
                    <p>
                        {{ $t("invoice.total_tax") }} :
                        {{ formatAmountCurrency(order.total_tax_on_items) }}
                    </p>
                </div>
                <div class="barcode-details">
                    <vue-barcode :value="order.invoice_number" :options="{ height: 25, width: 1, fontSize: 15 }"
                        tag="svg"></vue-barcode>
                </div>
                <div class="thanks-details">
                    <h3 style="text-align: center">{{ $t("invoice.thanks_message") }}</h3>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="footer-button">
                <a-button type="primary" @click="printInvoice">
                    <template #icon>
                        <PrinterOutlined />
                    </template>
                    {{ $t("common.print_invoice") }}
                </a-button>
            </div>
        </template>
    </a-modal>
</template>

<script>
import { ref, defineComponent } from "vue";
import { PrinterOutlined } from "@ant-design/icons-vue";
import common from "../../../../common/composable/common";
const posInvoiceCssUrl = window.config.pos_invoice_css;

export default defineComponent({
    props: ["visible", "order"],
    emits: ["closed", "success"],
    components: {
        PrinterOutlined,
    },
    setup(props, { emit }) {
        const { formatAmountCurrency, formatDate, selectedWarehouse } = common();

        const onClose = () => {
            emit("closed");
        };

        const printInvoice = () => {
            var invoiceContent = document.getElementById("pos-invoice").innerHTML;
            var newWindow = window.open("", "", "height=500, width=500");
            newWindow.document.write(
                `<link rel="stylesheet" href="${posInvoiceCssUrl}"><html><body>`
            );
            newWindow.document.write(invoiceContent);
            newWindow.document.write("</body></html>");
            newWindow.document.close();
            newWindow.print();
        };

        return {
            onClose,
            formatDate,
            selectedWarehouse,
            formatAmountCurrency,
            printInvoice,
        };
    },
});
</script>
