<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\PartnersTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\PartnersTable Test Case
 */
class PartnersTableTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \App\Model\Table\PartnersTable
     */
    public $Partners;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.Partners',
        'app.Companies',
        'app.Groups',
        'app.Invoices'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::getTableLocator()->exists('Partners') ? [] : ['className' => PartnersTable::class];
        $this->Partners = TableRegistry::getTableLocator()->get('Partners', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Partners);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
