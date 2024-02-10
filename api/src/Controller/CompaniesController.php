<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Core\Configure;

/**
 * Companies Controller
 *
 * @property \App\Model\Table\CompaniesTable $Companies
 *
 * @method \App\Model\Entity\Company[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class CompaniesController extends AppController
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index()
    {
        $companies = $this->paginate($this->Companies);

        $this->set(compact('companies'));
        $this->viewBuilder()->setOption('serialize', ['companies']);
    }

    public function accessible()
    {
        $companies = $this->Companies->find()
            ->where(['Companies.id IN' => json_decode($this->Authentication->getIdentity()->additional_data)]);

        $this->set(compact('companies'));
        $this->viewBuilder()->setOption('serialize', ['companies']);
    }

    public function setDefault()
    {
        if (!$this->request->getData('company')) {
            $companies = $this->Companies->find('list');
            $this->set(compact('companies'));
            return;
        }

        $company = $this->Companies->get($this->request->getData('company'));
        $this->getRequest()->getSession()->write('company', $company);
        Configure::write('company_id', $company->id);
        $this->redirect('/');
    }
}
