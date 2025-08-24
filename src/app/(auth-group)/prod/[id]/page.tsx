import ProductSaleChart from "@/components/ProductSaleChart";
import AddSale from "@/components/buttons/AddSale";
import BackButton from "@/components/buttons/BackButton";
import DeleteProd from "@/components/buttons/DeleteProd";
import EditProduct from "@/components/buttons/EditProduct";
import { ONE_PROD } from "@/lib/gql/queries";
import { gqlClient } from "@/lib/service/gql";
import { Badge, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Product, Sale } from "../../../../../generated/prisma";

type p = Promise<{ id: string }>;

export default async function page({ params }: { params: p }) {
  const { id } = await params;

  const data: {
    getProdById: Product & { Sale: Sale[] };
  } = await gqlClient.request(ONE_PROD, {
    getProdByIdId: id,
  });

  const prod = data.getProdById;

  const chartData =
    prod.Sale?.map((s) => {
      const date = new Date(Number(s.createdAt));
      const format = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      return {
        date: format,
        quantity: s.quantity,
      };
    }) || [];
  // console.log(chartData);

  // Step 1: get aggregated sales per day (your existing logic)
  const aggregated: { date: string; quantity: number }[] = [];
  chartData.forEach((val) => {
    const sale = aggregated.find((v) => v.date === val.date);
    if (sale) {
      sale.quantity += val.quantity;
    } else {
      aggregated.push({ ...val });
    }
  });

  // Helper: format date as d-m-y
  const formatDate = (d: Date) =>
    `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;

  // Step 2: find min and max dates
  const parseDate = (str: string) => {
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const dates = aggregated.map((s) => parseDate(s.date).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Step 3: build finalData from min → max
  const finalData: { date: string; quantity: number }[] = [];

  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    const formatted = formatDate(d);
    const found = aggregated.find((s) => s.date === formatted);
    finalData.push({
      date: formatted,
      quantity: found ? found.quantity : 0,
    });
  }

  console.log(finalData);

  return (
    <div className="min-h-screen w-full p-8 mt-16">
      <BackButton />
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="shadow-lg rounded-2xl w-full lg:w-1/2 p-6">
          <Flex direction="column" gap="4">
            <img
              src={prod?.imageUrl || "/product.jpg"}
              className="h-64 w-full object-cover rounded-xl"
              alt={prod.title}
            />

            <div className="flex justify-between items-center">
              <Heading size="5" className="truncate">
                {prod.title}
              </Heading>
              <Badge color="orange" size="3">
                {prod.category}
              </Badge>
            </div>

            <Text size="4" className="text-gray-600">
              {prod.description}
            </Text>

            <div>
              <Text weight="bold" size="3">
                Price: &nbsp;
                <span className="text-green-600 text-lg">${prod.price}</span>
              </Text>
              <br /> <br />
              Stock: &nbsp;
              <Text
                className={`font-semibold text-lg ${
                  prod.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {prod.stock > 0 ? `${prod.stock} available` : "Out of stock"}
              </Text>
            </div>

            <div className="flex justify-between w-full items-center">
              <div className="w-[50%]">
                <AddSale product={prod} />
              </div>
              <div className="inline-flex items-center justify-center w-[15%] gap-4 mr-2">
                <div>
                  <EditProduct product={prod} />
                </div>
                <div>
                  <DeleteProd id={prod.id} />
                </div>
              </div>
            </div>
          </Flex>
        </Card>

        {chartData.length > 0 && (
          <Card className="shadow-lg rounded-2xl w-full lg:w-1/2 p-6">
            <Heading size="4" className="mb-4">
              Sales Trend
            </Heading>
            <div className="h-80 mt-[4rem]">
              <ProductSaleChart chartData={finalData} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
