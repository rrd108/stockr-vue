<?php

declare(strict_types=1);

namespace App\Controller;

use Cake\Core\Configure;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 * @method \App\Model\Entity\User[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class UsersController extends AppController
{

    public function beforeFilter(\Cake\Event\EventInterface $event)
    {
        parent::beforeFilter($event);
        $this->Authentication->allowUnauthenticated(['login', 'requestResetPassword']);
    }

    public function login()
    {
        $result = $this->Authentication->getResult();
        $user = [];
        if ($result->isValid()) {
            $userIdentity = $this->Authentication->getIdentity();
            $user = [
                'id' => $userIdentity->id,
                'token' => $userIdentity->token
            ];
        }
        $this->set(compact('user'));
        $this->viewBuilder()->setOption('serialize', ['user']);
    }

    public function requestResetPassword()
    {
        $reference = $this->request->getData('reference');
        $user = $this->Users->resetToken($reference, [
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
