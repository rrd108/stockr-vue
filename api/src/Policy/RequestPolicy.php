<?php

namespace App\Policy;

use Cake\Core\Configure;
use Cake\Http\ServerRequest;
use Cake\Http\Exception\ForbiddenException;
use Authorization\Policy\RequestPolicyInterface;

class RequestPolicy implements RequestPolicyInterface
{
    /**
     * Method to check if the request can be accessed
     *
     * @param \Authorization\IdentityInterface|null $identity Identity
     * @param \Cake\Http\ServerRequest $request Server Request
     * @return bool
     */
    public function canAccess($identity, ServerRequest $request)
    {
        if (!$identity) {
            Configure::load('permissions', 'default', false);
            $permissions = Configure::read('Permissions.noAuth');
            return $this->checkPermission($permissions, $request);
        }

        if ($identity) {
            if ($identity->getOriginalData()->role == 'superuser') {
                return true;
            }

            Configure::load('permissions', 'default', false);
            $permissions = Configure::read('Permissions.' . $identity->getOriginalData()->role);
            return $this->checkPermission($permissions, $request);
        }
    }

    private function checkPermission(array $permissions, ServerRequest $request)
    {
        if (
            isset($permissions[$request->getParam('controller')])
            && in_array($request->getParam('action'), $permissions[$request->getParam('controller')])
        ) {
            return true;
        }
        throw new ForbiddenException('Authorization error');
        return false;
    }
}
