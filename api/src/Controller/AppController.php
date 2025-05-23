<?php

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller;

use Cake\View\JsonView;
use Cake\Core\Configure;
use Cake\Controller\Controller;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link https://book.cakephp.org/3.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $this->loadComponent('RequestHandler');

        $this->loadComponent('Authentication.Authentication');
        $this->loadComponent('Authorization.Authorization');

        $this->permissions = ['role' => isset($this->Authentication->getIdentity()->role) ? $this->Authentication->getIdentity()->role : null];

        $companyId = $this->request->getData('company') ? $this->request->getData('company') : $this->request->getQuery('company');
        if (!$companyId && $this->getRequest()->getSession()->read('company')) {
            $companyId = $this->getRequest()->getSession()->read('company')->id;
        }
        if ($companyId) {
            Configure::write('company_id', $companyId);
        }

        $currency = $this->request->getData('currency') ? $this->request->getData('currency') : $this->request->getQuery('currency');
        Configure::write('currency', $currency ? $currency : 'HUF');

        Configure::write('CakePdf', [
            'engine' => 'CakePdf.Mpdf',
            'margin' => [
                'bottom' => 15,
                'left' => 50,
                'right' => 30,
                'top' => 45
            ],
        ]);
    }

    public function viewClasses(): array
    {
        return [JsonView::class];
    }
}
