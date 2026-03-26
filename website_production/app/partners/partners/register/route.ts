import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/database';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  apiTier: z.enum(['free', 'pro', 'enterprise']),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if partner already exists
    const { data: existingPartner } = await supabaseAdmin
      .from('partners')
      .select('id')
      .eq('email', validatedData.email)
      .single();

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A partner with this email already exists' },
        { status: 400 }
      );
    }

    // Create new partner
    const { data: partner, error } = await supabaseAdmin
      .from('partners')
      .insert([
        {
          email: validatedData.email,
          company_name: validatedData.companyName,
          api_tier: validatedData.apiTier,
          website: validatedData.website || null,
          description: validatedData.description,
          api_key: null, // API key will be generated upon approval
          approved: false,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create partner registration' }, { status: 500 });
    }

    // TODO: Send email notification to admin and applicant
    // await sendEmail({
    //   to: validatedData.email,
    //   subject: 'Partner Application Received',
    //   body: `Thank you for applying to become a partner...`,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Partner application submitted successfully',
        partnerId: partner.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
