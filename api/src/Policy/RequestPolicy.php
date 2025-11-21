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
        // Always check noAuth permissions first - some actions like login should be accessible
        // even if there's an existing identity (e.g., logging in while already logged in)
        Configure::load('permissions', 'default', false);
        $noAuthPermissions = Configure::read('Permissions.noAuth');
        
        // Check if this action is in the noAuth list
        $controllerParam = $request->getParam('controller') ?? '';
        $controller = ucfirst($controllerParam);
        $action = $request->getParam('action') ?? '';
        
        if (
            is_array($noAuthPermissions)
            && isset($noAuthPermissions[$controller])
            && in_array($action, $noAuthPermissions[$controller])
        ) {
            // This action is allowed without authentication
            return true;
        }

        // If no identity, deny access (since it's not in noAuth)
        if (!$identity) {
            throw new ForbiddenException('Authorization error: Authentication required');
        }

        // Check role-based permissions
        if ($identity->getOriginalData()->role == 'superuser') {
            return true;
        }

        $permissions = Configure::read('Permissions.' . $identity->getOriginalData()->role);
        return $this->checkPermission($permissions, $request);
    }

    private function checkPermission(?array $permissions, ServerRequest $request)
    {
        if (!$permissions || !is_array($permissions)) {
            throw new ForbiddenException('Authorization error: No permissions array');
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
        throw new ForbiddenException("Authorization error: controller={$controller}, action={$action}");
    }
}
