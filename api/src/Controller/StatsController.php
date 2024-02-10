<?php

namespace App\Controller;

use Cake\Core\Configure;
use App\Controller\AppController;
use Cake\ORM\Locator\LocatorAwareTrait;

class StatsController extends AppController
{
    use LocatorAwareTrait;

    public function index()
    {
        $invoicesTable = $this->fetchTable('Invoices');
        $partnersTable = $this->fetchTable('Partners');
        $productsTable = $this->fetchTable('Products');

        $totals = [
            'sells' => collection(
                $invoicesTable->find('withTotal')
                    ->where([
                        'sale' => true,
                        'Storages.company_id' => Configure::read('company_id'),
                        'YEAR(Invoices.date)' => date('Y')
                    ])
            )->sumOf('total'),
            'purchases' => collection(
                $invoicesTable->find('withTotal')
                    ->where([
                        'sale' => false,
                        'Storages.company_id' => Configure::read('company_id'),
                        'YEAR(Invoices.date)' => date('Y')
                    ])
            )->sumOf('total'),
            'stock' => $productsTable->find('stock')->sumOf('stock'),
        ];
        $invoices = $invoicesTable->find()->where([
            'Storages.company_id' => Configure::read('company_id'),
            'YEAR(Invoices.date)' => date('Y')
        ])->count();
        $partners = $partnersTable->find()->count();
        $products = $productsTable->find()->count();

        $stats = [
            'invoices' => $invoices,
            'partners' => $partners,
            'products' => $products,
            'totals' => $totals
        ];

        $this->set(compact('invoices', 'partners', 'products', 'totals', 'stats'));
        $this->set('_serialize', 'stats');
    }
}
