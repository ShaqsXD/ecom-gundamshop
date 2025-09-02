<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\IsoManual;
use App\Models\ManualSection;
use App\Models\Procedure;
use App\Models\Document;

class IsoManualSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default user if none exists
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'ISO Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create ISO 9001:2015 Quality Management System Manual
        $qmsManual = IsoManual::create([
            'title' => 'Quality Management System Manual',
            'iso_standard' => 'ISO 9001:2015',
            'description' => 'This manual describes the Quality Management System (QMS) implemented to meet the requirements of ISO 9001:2015. It outlines the policies, procedures, and processes necessary to ensure consistent delivery of products and services that meet customer and regulatory requirements.',
            'version' => '2.1',
            'status' => 'approved',
            'created_by' => $user->id,
            'approved_by' => $user->id,
            'approved_at' => now()->subDays(30),
            'effective_date' => now()->subDays(30)->toDateString(),
            'review_date' => now()->addYear()->toDateString(),
            'metadata' => [
                'certification_body' => 'ISO Certification Authority',
                'last_audit_date' => now()->subMonths(6)->toDateString(),
                'next_audit_date' => now()->addMonths(6)->toDateString(),
            ],
        ]);

        // Create main sections for ISO 9001
        $sections = [
            ['section_number' => '1', 'title' => 'Scope', 'section_type' => 'chapter', 'order_index' => 1],
            ['section_number' => '2', 'title' => 'Normative References', 'section_type' => 'chapter', 'order_index' => 2],
            ['section_number' => '3', 'title' => 'Terms and Definitions', 'section_type' => 'chapter', 'order_index' => 3],
            ['section_number' => '4', 'title' => 'Context of the Organization', 'section_type' => 'chapter', 'order_index' => 4],
            ['section_number' => '5', 'title' => 'Leadership', 'section_type' => 'chapter', 'order_index' => 5],
            ['section_number' => '6', 'title' => 'Planning', 'section_type' => 'chapter', 'order_index' => 6],
            ['section_number' => '7', 'title' => 'Support', 'section_type' => 'chapter', 'order_index' => 7],
            ['section_number' => '8', 'title' => 'Operation', 'section_type' => 'chapter', 'order_index' => 8],
            ['section_number' => '9', 'title' => 'Performance Evaluation', 'section_type' => 'chapter', 'order_index' => 9],
            ['section_number' => '10', 'title' => 'Improvement', 'section_type' => 'chapter', 'order_index' => 10],
        ];

        foreach ($sections as $sectionData) {
            $section = ManualSection::create([
                'manual_id' => $qmsManual->id,
                ...$sectionData,
                'content' => $this->getSectionContent($sectionData['section_number']),
                'is_required' => true,
                'requirements' => $this->getSectionRequirements($sectionData['section_number']),
            ]);

            // Add subsections for some main sections
            if ($sectionData['section_number'] === '4') {
                $this->createSubsections($section, [
                    ['4.1', 'Understanding the Organization and its Context'],
                    ['4.2', 'Understanding the Needs and Expectations of Interested Parties'],
                    ['4.3', 'Determining the Scope of the Quality Management System'],
                    ['4.4', 'Quality Management System and its Processes'],
                ]);
            }

            if ($sectionData['section_number'] === '5') {
                $this->createSubsections($section, [
                    ['5.1', 'Leadership and Commitment'],
                    ['5.2', 'Policy'],
                    ['5.3', 'Organizational Roles, Responsibilities and Authorities'],
                ]);
            }
        }

        // Create sample procedures
        $contextSection = ManualSection::where('manual_id', $qmsManual->id)
            ->where('section_number', '4')
            ->first();

        if ($contextSection) {
            Procedure::create([
                'section_id' => $contextSection->id,
                'procedure_code' => 'QMS-001',
                'title' => 'Context Analysis Procedure',
                'purpose' => 'To establish a systematic approach for understanding the organization and its context',
                'scope' => 'This procedure applies to all organizational units and processes',
                'procedure_steps' => json_encode([
                    '1. Identify internal and external issues',
                    '2. Analyze stakeholder requirements',
                    '3. Document context analysis',
                    '4. Review and update annually'
                ]),
                'responsibilities' => 'Quality Manager: Overall responsibility\nDepartment Heads: Provide input\nManagement Team: Review and approve',
                'status' => 'approved',
                'version' => '1.2',
                'owner_id' => $user->id,
                'effective_date' => now()->subDays(60)->toDateString(),
                'review_date' => now()->addMonths(6)->toDateString(),
            ]);
        }

        // Create sample documents
        Document::create([
            'manual_id' => $qmsManual->id,
            'section_id' => $contextSection?->id,
            'document_code' => 'DOC-001',
            'title' => 'Context Analysis Template',
            'description' => 'Template for documenting organizational context analysis',
            'document_type' => 'template',
            'version' => '1.0',
            'status' => 'approved',
            'created_by' => $user->id,
            'approved_by' => $user->id,
            'approved_at' => now()->subDays(45),
            'tags' => ['context', 'analysis', 'template'],
        ]);

        // Create Environmental Management System Manual
        $emsManual = IsoManual::create([
            'title' => 'Environmental Management System Manual',
            'iso_standard' => 'ISO 14001:2015',
            'description' => 'This manual establishes the framework for our Environmental Management System (EMS) in accordance with ISO 14001:2015 requirements.',
            'version' => '1.0',
            'status' => 'draft',
            'created_by' => $user->id,
            'effective_date' => now()->addDays(30)->toDateString(),
            'review_date' => now()->addYear()->toDateString(),
        ]);
    }

    private function getSectionContent(string $sectionNumber): string
    {
        $content = [
            '1' => 'This manual applies to the Quality Management System of [Organization Name] and covers all activities related to the design, development, production, installation, and servicing of [products/services].',
            '4' => 'The organization determines external and internal issues that are relevant to its purpose and strategic direction and that affect its ability to achieve the intended result(s) of its quality management system.',
            '5' => 'Top management demonstrates leadership and commitment with respect to the quality management system.',
            '6' => 'The organization establishes, implements, maintains and continually improves a quality management system, including the processes needed and their interactions.',
            '7' => 'The organization determines and provides the resources needed for the establishment, implementation, maintenance and continual improvement of the quality management system.',
            '8' => 'The organization plans, implements and controls the processes needed to meet the requirements for the provision of products and services.',
            '9' => 'The organization determines what needs to be monitored and measured, the methods for monitoring, measurement, analysis and evaluation.',
            '10' => 'The organization determines and selects opportunities for improvement and implements any necessary actions to meet customer requirements and enhance customer satisfaction.',
        ];

        return $content[$sectionNumber] ?? 'Content for this section will be developed.';
    }

    private function getSectionRequirements(string $sectionNumber): array
    {
        $requirements = [
            '4' => [
                'context_analysis' => 'Documented analysis of organizational context',
                'stakeholder_analysis' => 'Identification of interested parties and their requirements',
                'scope_definition' => 'Clear definition of QMS scope',
                'process_interaction' => 'Documentation of process interactions',
            ],
            '5' => [
                'leadership_commitment' => 'Evidence of top management commitment',
                'quality_policy' => 'Established and communicated quality policy',
                'roles_responsibilities' => 'Defined organizational roles and responsibilities',
            ],
        ];

        return $requirements[$sectionNumber] ?? [];
    }

    private function createSubsections(ManualSection $parentSection, array $subsections): void
    {
        foreach ($subsections as $index => $subsection) {
            ManualSection::create([
                'manual_id' => $parentSection->manual_id,
                'parent_section_id' => $parentSection->id,
                'section_number' => $subsection[0],
                'title' => $subsection[1],
                'section_type' => 'subsection',
                'order_index' => $index + 1,
                'is_required' => true,
                'content' => 'This subsection addresses specific requirements and implementation guidelines.',
            ]);
        }
    }
}
