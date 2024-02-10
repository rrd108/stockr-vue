<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Event\Event;

/**
 * Products Controller
 *
 * @property \App\Model\Table\ProductsTable $Products
 *
 * @method \App\Model\Entity\Product[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ProductsController extends AppController
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index()
    {
        $products = $this->Products->find('purchasePrice', ['currency' => Configure::read('currency')]);

        $this->set(compact('products'));
        $this->viewBuilder()->setOption('serialize', ['products']);
    }

    /**
     * View method
     *
     * @param string|null $id Product id.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $product = $this->Products->get($id, [
            'contain' => [
                'Companies',
                'Items.Invoices' => ['Partners', 'Storages']
            ]
        ]);

        $product = $this->Products->find('purchasePrice', ['currency' => Configure::read('currency')])
            ->where(['Products.id' => $id])
            ->contain(['Companies', 'Items.Invoices' => ['Partners', 'Storages']])
            ->first();
        $this->set(compact('product'));
        $this->viewBuilder()->setOption('serialize', ['product']);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $product = $this->Products->newEntity();
        if ($this->request->is('post')) {
            $product = $this->Products->patchEntity($product, $this->request->getData());
            $this->Products->save($product);
        }
        $this->set(compact('product'));
        $this->viewBuilder()->setOption('serialize', ['product']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Product id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $product = $this->Products->get($id);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $product = $this->Products->patchEntity($product, $this->request->getData());
            $this->Products->save($product);
        }
        $this->set(compact('product'));
        $this->viewBuilder()->setOption('serialize', ['product']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Product id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $product = $this->Products->get($id);
        if ($this->Products->delete($product)) {
            $this->Flash->success(__('The product has been deleted.'));
        } else {
            $this->Flash->error(__('The product could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }

    public function stock()
    {
        // TODO sells should only show for this year ?
        $products = $this->Products->find('purchasePrice', ['currency' => Configure::read('currency')])
            // TODO stock calculation will become slower and slower each year
            ->find('stock', ['stockDate' => $this->request->getQuery('stockDate')])
            ->find('sells', ['stockDate' => $this->request->getQuery('stockDate')])
            //->find('lastSellPrice');  TODO
            ->order('Products.name');

        $this->set(compact('product'));
        $this->viewBuilder()->setOption('serialize', ['product']);
    }

    public function stockRotation()
    {
        $lastYear = $this->Products
            ->find('lastPurchases', ['startDate' => date('Y-m-d', strtotime('-1 year'))])
            ->find('lastSells', ['startDate' => date('Y-m-d', strtotime('-1 year'))]);
        $stock = $this->Products
            ->find('stock', ['stockDate' => $this->request->getQuery('stockDate')]);

        $rotation = $this->Products->find()
            ->select([
                'id' => 'stock.Products__id',
                'name' => 'stock.Products__name',
                'code' => 'stock.Products__code',
                'size' => 'stock.Products__size',
                'stock' => 'stock.stock',
                'purchases' => 'lastYear.purchases',
                'sells' => 'lastYear.sells',
                'sellsIncome' => 'lastYear.sellsIncome',
                'sellDays' => 'DATEDIFF(CURDATE(), lastYear.date)'
            ])
            ->enableAutoFields(false)
            ->from(['stock' => $stock])
            ->leftJoin(
                ['lastYear' => $lastYear],
                ['lastYear.Products__id = stock.Products__id']
            );
        $this->set(compact('product'));
        $this->viewBuilder()->setOption('serialize', ['product']);
    }
}
