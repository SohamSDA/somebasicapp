import {
  Section,
  Row,
  Column,
  Text,
  Hr,
} from "@react-email/components";

type EmailTemplateProps = {
  firstName: string;
  verifyCode: string;
};

export const EmailTemplate = ({ firstName, verifyCode }: EmailTemplateProps) => {
  return (
    <Section className="my-[32px]">
      <Row>
        <Column>
          <Text className="text-[24px] font-bold text-gray-900 m-0 leading-[32px]">
            Verify your email
          </Text>
          <Text className="text-[16px] text-gray-600 mt-[8px] leading-[24px]">
            Hi {firstName}, thanks for signing up! Please use the code below to verify your email address.
          </Text>
        </Column>
      </Row>

      <Row className="my-[24px]">
        <Column>
          <Text className="text-center text-[32px] font-semibold tracking-widest text-indigo-600">
            {verifyCode}
          </Text>
        </Column>
      </Row>

      <Hr className="!border-gray-300 my-[24px]" />

      <Row>
        <Column>
          <Text className="text-[14px] text-gray-500">
            This code will expire in 15 minutes. If you didn’t request this, you can safely ignore this email.
          </Text>
        </Column>
      </Row>
    </Section>
  );
};
