<?php

namespace App\Policy;

use Cake\Core\Configure;
use Cake\Http\ServerRequest;
use Cake\Http\Exception\ForbiddenException;
use Authorization\Policy\RequestPolicyInterface;
use Authorization\IdentityInterface;
use Authorization\Policy\ResultInterface;

class RequestPolicy implements RequestPolicyInterface
{
    /**
     * Method to check if the request can be accessed
     *
     * @param \Authorization\IdentityInterface|null $identity Identity
     * @param \Cake\Http\ServerRequest $request Server Request
     * @return \Authorization\Policy\ResultInterface|bool
     */
    public function canAccess(?IdentityInterface $identity, ServerRequest $request): ResultInterface|bool
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

    private function checkPermission(?array $permissions, ServerRequest $request)
    {
        if (!$permissions || !is_array($permissions)) {
            throw new ForbiddenException('Authorization error');
        }

        $controllerParam = $request->getParam('controller') ?? '';
        $controller = ucfirst($controllerParam);
        $action = $request->getParam('action') ?? '';

        if (
            isset($permissions[$controller])
            && in_array($action, $permissions[$controller])
        ) {
            return true;
        }
        throw new ForbiddenException('Authorization error');
    }
}
