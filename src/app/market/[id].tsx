import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { Coupon } from "@/components/market/coupon";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { api } from "@/services/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Modal, ScrollView, StatusBar, View } from "react-native";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const params = useLocalSearchParams<{ id: string }>();
  const [permission, requestPermission] = useCameraPermissions();

  const [data, setData] = useState<DataProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState<string | null>(null);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [couponIsFetching, setCouponIsFetching] = useState(false);

  const qrlock = useRef(false);
  console.log(params.id);

  async function fetchMarket() {
    try {
      if (!params.id) return;
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Estabelecimento",
        "Ocorreu um erro ao buscar o estabelecimento.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        Alert.alert("Câmera", "Você precisa permitir acesso ao câmera.", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }
      qrlock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Câmera", "Não foi possivel abrir a câmera.");
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await api.patch(`/coupons/${params.id}`);

      Alert.alert("Cupom", data.coupon);

      setCoupons(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar o cupom.");
    } finally {
      setCouponIsFetching(false);
    }
  }

  async function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possível usar o cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        {style: "cancel", text: "Não"},
        {text: "Sim", onPress: () => getCoupon(id)}
      ]
    )
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupons]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <StatusBar barStyle={"light-content"} hidden={isVisibleCameraModal} /> */}
      <StatusBar barStyle={"light-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupons && <Coupon code={coupons} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrlock.current) {
              qrlock.current = true;
              setTimeout(() => {
                handleUseCoupon(data);
              }, 500);
            }
          }}
        />
        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
