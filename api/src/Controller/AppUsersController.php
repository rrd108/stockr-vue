<?php

namespace App\Controller;

use App\Model\Table\AppUsersTable;
use Cake\Core\Configure;
use Cake\Event\Event;
use CakeDC\Users\Controller\AppController as CakeDCAppController;
use CakeDC\Users\Controller\Component\UsersAuthComponent;
use CakeDC\Users\Controller\Traits\LoginTrait;
use CakeDC\Users\Controller\Traits\RegisterTrait;

class AppUsersController extends CakeDCAppController
{
    use LoginTrait;
    use RegisterTrait;

    public function initialize(): void
    {
        parent::initialize();
        $this->Authentication->allowUnauthenticated(['login', 'getToken', 'requestResetPassword']);
    }

    public function getToken()
    {
        $user = $this->Authentication->identify();
        // TODO get the token $user = ['token' => $user['api_key']];
        $this->set(compact('user'));
        $this->viewBuilder()->setOption('serialize', ['user']);
    }

    public function requestResetPassword()
    {
        $reference = $this->request->getData('reference');
        $user = $this->getUsersTable()->resetToken($reference, [
            'expiration' => Configure::read('Users.Token.expiration'),
            'checkActive' => false,
            'sendEmail' => true,
            'ensureActive' => Configure::read('Users.Registration.ensureActive'),
            'type' => 'password'
        ]);
        if ($user) {
            $this->set(compact('user'));
            $this->viewBuilder()->setOption('serialize', ['user']);
        }
    }
}
