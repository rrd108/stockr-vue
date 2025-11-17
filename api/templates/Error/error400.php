<?php
/**
 * @var \App\View\AppView $this
 * @var \Cake\Database\StatementInterface $error
 * @var string $message
 * @var string $url
 */
use Cake\Core\Configure;
use Cake\Error\Debugger;

$this->layout = 'error';

if (Configure::read('debug')) :
    $this->layout = 'dev_error';

    $this->assign('title', $message);
    $this->assign('templateName', 'error400.php');

    $this->start('file');
?>
<?php if (!empty($error->queryString)) : ?>
    <p class="notice">
        <strong>SQL Query: </strong>
        <?= htmlspecialchars($error->queryString, ENT_QUOTES, 'UTF-8') ?>
    </p>
<?php endif; ?>
<?php if (!empty($error->params)) : ?>
        <strong>SQL Query Params: </strong>
        <?php Debugger::dump($error->params) ?>
<?php endif; ?>
<?= $this->element('auto_table_warning') ?>
<?php

$this->end();
endif;
?>
<h2><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></h2>
<p class="error">
    <strong>Error: </strong>
    <?= sprintf('The requested address %s was not found on this server.', '<strong>\'' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '\'</strong>') ?>
</p>
